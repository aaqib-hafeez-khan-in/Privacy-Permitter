const PERMISSIONS_RISK = {
  "all_urls": 40,
  "<all_urls>": 40,
  "browsingData": 35,
  "webRequest": 30,
  "webRequestBlocking": 30,
  "tabs": 20,
  "history": 25,
  "cookies": 20,
  "downloads": 15,
  "clipboardRead": 20,
  "geolocation": 25,
  "nativeMessaging": 30
};

const DEFAULT_RISK = 2;

function calculateRiskScore(permissions, hostPermissions) {
  let score = 0;
  const flaggedPermissions = [];
  
  if (permissions) {
    for (const perm of permissions) {
      const weight = PERMISSIONS_RISK[perm] || DEFAULT_RISK;
      score += weight;
      if (weight > 0) {
        flaggedPermissions.push(perm);
      }
    }
  }
  
  if (hostPermissions) {
    for (const hostPerm of hostPermissions) {
      if (hostPerm === "<all_urls>" || hostPerm === "*://*/*" || hostPerm === "https://*/*" || hostPerm === "http://*/*") {
        score += 40;
        if (!flaggedPermissions.includes("<all_urls>")) {
          flaggedPermissions.push("<all_urls>");
        }
      }
    }
  }
  
  return { score, flaggedPermissions };
}

function getCategory(score) {
  if (score >= 50) return "Critical";
  if (score >= 20) return "Warning";
  return "Safe";
}

function sortExtensions(extensions) {
  const categoryOrder = { "Critical": 0, "Warning": 1, "Safe": 2 };
  return extensions.sort((a, b) => {
    return categoryOrder[a.category] - categoryOrder[b.category] || b.score - a.score;
  });
}

let allExtensions = [];
let currentFilter = "all";
let searchQuery = "";

function renderExtensions() {
  const listEl = document.getElementById("extension-list");
  listEl.innerHTML = "";
  
  let filtered = allExtensions.filter(ext => {
    const matchesSearch = ext.name.toLowerCase().includes(searchQuery);
    const matchesFilter = currentFilter === "all" || ext.category === currentFilter;
    return matchesSearch && matchesFilter;
  });
  
  if (filtered.length === 0) {
    listEl.innerHTML = '<div class="no-results">No extensions found</div>';
    return;
  }
  
  for (const ext of filtered) {
    const card = document.createElement("div");
    card.className = "extension-card";
    
    const badge = document.createElement("span");
    badge.className = `badge ${ext.category.toLowerCase()}`;
    badge.textContent = ext.category;
    
    const header = document.createElement("div");
    header.className = "card-header";
    
    const name = document.createElement("span");
    name.className = "extension-name";
    name.textContent = ext.name;
    
    const score = document.createElement("span");
    score.className = "score";
    score.textContent = `Score: ${ext.score}`;
    
    header.appendChild(name);
    header.appendChild(score);
    
    const tagsContainer = document.createElement("div");
    tagsContainer.className = "permission-tags";
    
    for (const perm of ext.flaggedPermissions) {
      const tag = document.createElement("span");
      tag.className = "permission-tag";
      tag.textContent = perm;
      tagsContainer.appendChild(tag);
    }
    
    card.appendChild(badge);
    card.appendChild(header);
    card.appendChild(tagsContainer);
    
    listEl.appendChild(card);
  }
}

function updateSummary() {
  const critical = allExtensions.filter(e => e.category === "Critical").length;
  const warning = allExtensions.filter(e => e.category === "Warning").length;
  const safe = allExtensions.filter(e => e.category === "Safe").length;
  
  document.getElementById("critical-count").textContent = critical;
  document.getElementById("warning-count").textContent = warning;
  document.getElementById("safe-count").textContent = safe;
}

function loadExtensions() {
  chrome.management.getAll(extensions => {
    const thisId = chrome.runtime.id;
    
    allExtensions = extensions
      .filter(ext => ext.id !== thisId && ext.enabled !== false)
      .map(ext => {
        const perms = ext.permissions || [];
        const hostPerms = ext.hostPermissions || [];
        const { score, flaggedPermissions } = calculateRiskScore(perms, hostPerms);
        const category = getCategory(score);
        
        return {
          name: ext.name,
          score,
          category,
          flaggedPermissions
        };
      });
    
    allExtensions = sortExtensions(allExtensions);
    updateSummary();
    renderExtensions();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadExtensions();
  
  document.getElementById("search-input").addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderExtensions();
  });
  
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      renderExtensions();
    });
  });
});
