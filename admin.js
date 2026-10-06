/* ==========================================================================
   LEARN MORE DATA - Administration des paiements
   Accès réservé : connexion Supabase Auth + présence dans la table "admins".
   ========================================================================== */
(() => {
  const PROOF_BUCKET = "payment-proofs";
  const OPERATORS = { orangeMoney: "Orange Money", airtelMoney: "Airtel Money", mPesa: "Vodacom M-Pesa" };
  const STATUS_LABELS = { pending: "En attente", approved: "Validé", rejected: "Refusé" };

  const $ = (id) => document.getElementById(id);
  const loginView = $("loginView");
  const dashView = $("dashView");

  if (!window.supabase || !window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
    loginView.style.display = "block";
    $("loginError").textContent = "Supabase n'est pas configuré (voir config.js).";
    return;
  }
  const db = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

  let currentStatus = "pending";

  function show(isDash) {
    dashView.style.display = isDash ? "block" : "none";
    loginView.style.display = isDash ? "none" : "block";
  }

  async function isAdmin(user) {
    const { data, error } = await db.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
    return !error && !!data;
  }

  async function boot() {
    const { data } = await db.auth.getSession();
    const user = data.session && data.session.user;
    if (user && (await isAdmin(user))) {
      show(true);
      loadPayments();
    } else {
      if (user) await db.auth.signOut();
      show(false);
    }
  }

  $("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    $("loginError").textContent = "";
    const { data, error } = await db.auth.signInWithPassword({
      email: $("loginEmail").value.trim(),
      password: $("loginPassword").value
    });
    if (error) {
      $("loginError").textContent = "E-mail ou mot de passe incorrect.";
      return;
    }
    if (!(await isAdmin(data.user))) {
      await db.auth.signOut();
      $("loginError").textContent = "Ce compte n'a pas accès à l'administration.";
      return;
    }
    $("loginPassword").value = "";
    show(true);
    loadPayments();
  });

  $("logoutBtn").addEventListener("click", async () => {
    await db.auth.signOut();
    $("payList").replaceChildren();
    show(false);
  });

  $("statusTabs").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-status]");
    if (!btn) return;
    currentStatus = btn.dataset.status;
    document.querySelectorAll("#statusTabs button").forEach((b) => b.classList.toggle("active", b === btn));
    loadPayments();
  });

  async function loadPayments() {
    const list = $("payList");
    $("dashError").textContent = "";
    const { data, error } = await db
      .from("payments")
      .select("*")
      .eq("status", currentStatus)
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) {
      $("dashError").textContent = "Impossible de charger les paiements.";
      return;
    }
    if (!data.length) {
      const empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = "Aucun paiement.";
      list.replaceChildren(empty);
      return;
    }
    list.replaceChildren(...data.map(renderCard));
  }

  function line(label, value) {
    const el = document.createElement("span");
    el.textContent = `${label} : ${value}`;
    return el;
  }

  // Tout le contenu saisi par les visiteurs passe par textContent (jamais innerHTML).
  function renderCard(p) {
    const card = document.createElement("article");
    card.className = "glass-card pay-card";

    const thumb = document.createElement("img");
    thumb.className = "pay-thumb";
    thumb.alt = "Preuve de paiement";
    db.storage.from(PROOF_BUCKET).createSignedUrl(p.proof_path, 600).then(({ data }) => {
      if (!data) return;
      thumb.src = data.signedUrl;
      thumb.addEventListener("click", () => window.open(data.signedUrl, "_blank", "noopener"));
    });

    const info = document.createElement("div");
    info.className = "pay-info";
    const name = document.createElement("strong");
    name.textContent = p.full_name;
    const badge = document.createElement("span");
    badge.className = `badge ${p.status}`;
    badge.textContent = STATUS_LABELS[p.status];
    const how = p.rail === "RDC" ? `Mobile Money – ${OPERATORS[p.operator] || "?"}` : `Chariow – ${p.country_code || "?"}`;
    info.append(
      name,
      line("E-mail", p.email),
      line("Mode", how),
      line("Montant", `$${Number(p.amount_usd).toFixed(2)}`),
      line("Reçu le", new Date(p.created_at).toLocaleString("fr-FR")),
      badge
    );

    const actions = document.createElement("div");
    actions.className = "pay-actions";
    if (p.status !== "approved") actions.append(actionButton("Valider", "approved", p.id, "btn-primary"));
    if (p.status !== "rejected") actions.append(actionButton("Refuser", "rejected", p.id, "btn-secondary"));

    card.append(thumb, info, actions);
    return card;
  }

  function actionButton(label, status, id, cls) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = cls;
    btn.textContent = label;
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      const { data: { user } } = await db.auth.getUser();
      const { error } = await db
        .from("payments")
        .update({ status, reviewed_at: new Date().toISOString(), reviewed_by: user.id })
        .eq("id", id);
      if (error) {
        $("dashError").textContent = "La mise à jour a échoué.";
        btn.disabled = false;
        return;
      }
      loadPayments();
    });
    return btn;
  }

  boot();
})();
