/**
 * UI - 通用组件 & 工具函数
 */
window.UI = (() => {
  // ========== SVG Icons ==========
  const ICONS = {
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
    more: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',

    // Home page icons
    stockIn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M8 11l4 4 4-4"/><path d="M20 21H4"/><path d="M20 17H4"/></svg>',
    stockOut: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3M8 7l4-4 4 4"/><path d="M20 21H4"/><path d="M20 17H4"/></svg>',
    transfer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16l-4-4 4-4"/><path d="M17 8l4 4-4 4"/><path d="M3 12h18"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 12l2 2 4-4"/></svg>',
    docIn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="M9 15l3 3 3-3"/></svg>',
    docOut: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M12 12v6"/><path d="M9 15l3-3 3 3"/></svg>',
    docTransfer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M8 15h8"/><path d="M13 12l3 3-3 3"/></svg>',
    docCheck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M9 15l2 2 4-4"/></svg>',
    inventory: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>',
    alertIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/><line x1="12" y1="2" x2="12" y2="4"/></svg>',
    expiry: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    warehouse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>',
    category: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    product: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05"/><path d="M12 22.08V12"/></svg>',
    partner: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
    barcode: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5v14"/><path d="M8 5v14"/><path d="M12 5v14"/><path d="M17 5v14"/><path d="M21 5v14"/></svg>',

    // Tab bar
    homeTab: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>',
    chartTab: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    teamTab: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>'
  };

  // ========== Header Component ==========
  function header(title, opts = {}) {
    const { showBack = true, rightIcon = '', rightAction = '', rightId = '' } = opts;
    return `
      <header class="app-header">
        <div class="header-left">
          ${showBack ? `<button class="btn-back" onclick="Router.back()">${ICONS.back}</button>` : ''}
        </div>
        <h1 class="header-title">${title}</h1>
        <div class="header-right">
          ${rightIcon ? `<button class="btn-header-action" ${rightId ? `id="${rightId}"` : ''} ${rightAction}>${rightIcon}</button>` : '<span></span>'}
        </div>
      </header>
    `;
  }

  // ========== Tab Bar Component ==========
  function tabbar(active = 'home') {
    const tabs = [
      { id: 'home', label: '首页', path: '/', icon: ICONS.homeTab },
      { id: 'stats', label: '统计分析', path: '/stats', icon: ICONS.chartTab },
      { id: 'team', label: '团队', path: '/team', icon: ICONS.teamTab }
    ];
    return `
      <nav class="tab-bar">
        ${tabs.map(tab => `
          <button class="tab-bar-item ${active === tab.id ? 'active' : ''}"
                  onclick="Router.navigate('${tab.path}')">
            ${tab.icon}
            <span>${tab.label}</span>
          </button>
        `).join('')}
      </nav>
    `;
  }

  // ========== Toast ==========
  function toast(message, type = 'info', duration = 2000) {
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = message;
    container.appendChild(el);
    requestAnimationFrame(() => {
      el.classList.add('show');
    });
    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 300);
    }, duration);
  }

  // ========== Modal ==========
  function showModal(title, bodyHtml, opts = {}) {
    const {
      confirmText = '确定',
      cancelText = '取消',
      showCancel = true,
      onConfirm = null,
      onCancel = null,
      center = false
    } = opts;

    const overlay = document.getElementById('modal-overlay');
    overlay.className = `modal-overlay ${center ? 'center' : ''}`;
    overlay.innerHTML = `
      <div class="modal-box">
        <div class="modal-header">
          <span class="modal-title">${title}</span>
          <button class="btn-close" id="modal-close-btn">${ICONS.close}</button>
        </div>
        <div class="modal-body">${bodyHtml}</div>
        <div class="modal-footer">
          ${showCancel ? `<button class="btn-cancel" id="modal-cancel-btn">${cancelText}</button>` : ''}
          <button class="btn-confirm" id="modal-confirm-btn">${confirmText}</button>
        </div>
      </div>
    `;

    // 关闭逻辑
    const close = () => { overlay.classList.add('hidden'); };

    document.getElementById('modal-close-btn').onclick = () => {
      close();
      if (onCancel) onCancel();
    };
    if (showCancel) {
      document.getElementById('modal-cancel-btn').onclick = () => {
        close();
        if (onCancel) onCancel();
      };
    }
    document.getElementById('modal-confirm-btn').onclick = () => {
      if (onConfirm) {
        const result = onConfirm();
        if (result !== false) close();
      } else {
        close();
      }
    };

    // 点击遮罩关闭
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        close();
        if (onCancel) onCancel();
      }
    };

    return overlay;
  }

  // ========== Confirm Dialog ==========
  function confirm(message) {
    return new Promise(resolve => {
      showModal('提示', `<p style="text-align:center;padding:8px 0;font-size:15px;">${message}</p>`, {
        center: true,
        onConfirm: () => { resolve(true); },
        onCancel: () => { resolve(false); }
      });
    });
  }

  // ========== Action Sheet ==========
  function actionSheet(items) {
    return new Promise(resolve => {
      const overlay = document.getElementById('modal-overlay');
      overlay.className = 'modal-overlay';
      overlay.innerHTML = `
        <div class="modal-box">
          <div class="action-sheet">
            ${items.map((item, i) => `
              <div class="action-sheet-item ${item.danger ? 'danger' : ''}" data-idx="${i}">
                ${item.label}
              </div>
            `).join('')}
          </div>
          <div class="action-sheet-cancel" id="action-sheet-cancel">取消</div>
        </div>
      `;

      const close = () => { overlay.classList.add('hidden'); };

      overlay.querySelectorAll('.action-sheet-item').forEach(el => {
        el.onclick = () => {
          const idx = parseInt(el.dataset.idx);
          close();
          resolve(idx);
        };
      });

      document.getElementById('action-sheet-cancel').onclick = () => {
        close();
        resolve(-1);
      };

      overlay.onclick = (e) => {
        if (e.target === overlay) {
          close();
          resolve(-1);
        }
      };
    });
  }

  // ========== Select Modal ==========
  function selectModal(title, options, currentValue) {
    return new Promise(resolve => {
      const html = `
        <div class="select-list">
          ${options.map(opt => `
            <div class="select-list-item ${opt.value === currentValue ? 'selected' : ''}" data-value="${opt.value}">
              <span>${opt.label}</span>
              ${opt.value === currentValue ? '<span class="check">✓</span>' : ''}
            </div>
          `).join('')}
        </div>
      `;

      const overlay = showModal(title, html, {
        showCancel: false,
        confirmText: '关闭',
        onConfirm: () => { resolve(null); }
      });

      overlay.querySelectorAll('.select-list-item').forEach(el => {
        el.onclick = () => {
          overlay.classList.add('hidden');
          resolve(el.dataset.value);
        };
      });
    });
  }

  // ========== Input Modal ==========
  function inputModal(title, placeholder = '', defaultValue = '') {
    return new Promise(resolve => {
      const html = `<input type="text" class="modal-input" id="modal-input-value" 
                           placeholder="${placeholder}" value="${defaultValue}" autocomplete="off">`;
      showModal(title, html, {
        onConfirm: () => {
          const val = document.getElementById('modal-input-value').value.trim();
          if (!val) {
            toast('请输入内容', 'error');
            return false;
          }
          resolve(val);
        },
        onCancel: () => { resolve(null); }
      });
      // 自动聚焦
      setTimeout(() => {
        const inp = document.getElementById('modal-input-value');
        if (inp) inp.focus();
      }, 100);
    });
  }

  // ========== Empty State ==========
  function empty(message = '暂无数据') {
    return `
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <p class="empty-text">${message}</p>
      </div>
    `;
  }

  // ========== Date Helpers ==========
  function formatDate(str) {
    if (!str) return '';
    return str.slice(0, 10);
  }

  function formatDateTime(isoStr) {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10);
  }

  // ========== CSV Export ==========
  function exportCSV(filename, headers, rows) {
    const BOM = '\uFEFF';
    let csv = BOM + headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${String(cell == null ? '' : cell).replace(/"/g, '""')}"`).join(',') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast('导出成功', 'success');
  }

  // ========== Icon Helper ==========
  function icon(name) {
    return ICONS[name] || '';
  }

  // ========== Public API ==========
  return {
    ICONS,
    icon,
    header,
    tabbar,
    toast,
    showModal,
    confirm,
    actionSheet,
    selectModal,
    inputModal,
    empty,
    formatDate,
    formatDateTime,
    today,
    daysAgo,
    exportCSV
  };
})();
