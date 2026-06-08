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
              <div class="select-list-item-content">${opt.label}</div>
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

  // ========== Multi Select Modal ==========
  function multiSelectModal(title, options, currentValues = []) {
    return new Promise(resolve => {
      let selectedSet = new Set(currentValues);
      let selectedCategory = '';
      let searchKeyword = '';

      const hasFilter = options.some(opt => 'categoryId' in opt || 'searchText' in opt);

      // Extract unique categories from options
      const catMap = new Map();
      options.forEach(opt => {
        if (opt.categoryId) {
          catMap.set(opt.categoryId, opt.categoryName || '其它');
        }
      });
      const uniqueCategories = Array.from(catMap.entries()).map(([id, name]) => ({ id, name }));
      const allCategories = [{ id: '', name: '全部' }, ...uniqueCategories];

      const renderList = () => {
        const filteredOptions = options.filter(opt => {
          const matchesCategory = !selectedCategory || opt.categoryId === selectedCategory;
          const queryTokens = searchKeyword.split(/\s+/).filter(Boolean);
          const matchesSearch = queryTokens.every(token => 
            (opt.searchText && opt.searchText.includes(token)) || 
            (opt.label && opt.label.toLowerCase().includes(token))
          );
          return matchesCategory && matchesSearch;
        });

        if (filteredOptions.length === 0) {
          return `<div style="text-align:center; padding: 32px 16px; color:var(--text-light); font-size:13px;">暂无匹配的商品</div>`;
        }

        return filteredOptions.map(opt => {
          const isSelected = selectedSet.has(opt.value);
          return `
            <div class="select-list-item ${isSelected ? 'selected' : ''}" data-value="${opt.value}" style="display:flex; align-items:center; gap:12px; cursor:pointer;">
              <div class="checkbox-box" style="width:20px; height:20px; border:2.5px solid var(--border); border-radius:6px; display:flex; align-items:center; justify-content:center; flex-shrink:0; background:${isSelected ? 'var(--primary)' : 'transparent'}; border-color:${isSelected ? 'var(--primary)' : 'var(--border)'}; color:white; font-size:12px; font-weight:bold; transition: all 0.2s;">
                ${isSelected ? '✓' : ''}
              </div>
              <div class="select-list-item-content" style="flex:1;">${opt.label}</div>
            </div>
          `;
        }).join('');
      };

      let bodyHtml = '';
      if (hasFilter) {
        bodyHtml = `
          <div class="modal-filter-wrap" style="margin-bottom: 12px; display: flex; flex-direction: column; gap: 8px;">
            <div class="filter-input-wrap" style="position: relative;">
              <span class="filter-search-icon" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text-light); width: 16px; height: 16px; display: flex; align-items: center; justify-content: center;">
                ${ICONS.search}
              </span>
              <input type="text" class="filter-search" id="modal-search-input" placeholder="输入名称、规格、厂家进行搜索..." style="width: 100%; padding: 8px 12px 8px 34px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 13px; background: var(--bg); color: var(--text);">
            </div>
            ${uniqueCategories.length > 0 ? `
              <div class="category-tabs" id="modal-category-tabs" style="padding: 4px 0; border-bottom: 1px solid var(--divider); display: flex; gap: 4px; overflow-x: auto; -webkit-overflow-scrolling: touch; margin-top: 4px;">
                ${allCategories.map(cat => `
                  <button class="category-tab ${selectedCategory === cat.id ? 'active' : ''}" data-cat-id="${cat.id}" style="padding: 6px 12px; font-size: 12px; border-radius: 20px; border: none; background: ${selectedCategory === cat.id ? 'var(--primary-bg)' : 'transparent'}; color: ${selectedCategory === cat.id ? 'var(--primary)' : 'var(--text-secondary)'}; font-weight: ${selectedCategory === cat.id ? '600' : 'normal'}; white-space: nowrap; transition: all 0.2s;">
                    ${cat.name}
                  </button>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `;
      }

      bodyHtml += `
        <div class="select-list" id="multi-select-list">
          ${renderList()}
        </div>
      `;

      const overlay = showModal(title, bodyHtml, {
        showCancel: true,
        cancelText: '取消',
        confirmText: '确定',
        onConfirm: () => {
          resolve(Array.from(selectedSet));
        },
        onCancel: () => {
          resolve(null);
        }
      });

      const bindListEvents = () => {
        const listEl = overlay.querySelector('#multi-select-list');
        if (!listEl) return;
        listEl.querySelectorAll('.select-list-item').forEach(el => {
          el.onclick = () => {
            const val = el.dataset.value;
            if (selectedSet.has(val)) {
              selectedSet.delete(val);
            } else {
              selectedSet.add(val);
            }
            listEl.innerHTML = renderList();
            bindListEvents();
          };
        });
      };

      const bindCategoryEvents = () => {
        const tabsEl = overlay.querySelector('#modal-category-tabs');
        if (!tabsEl) return;
        tabsEl.querySelectorAll('.category-tab').forEach(btn => {
          btn.onclick = () => {
            selectedCategory = btn.dataset.catId;
            // Update active states
            tabsEl.querySelectorAll('.category-tab').forEach(b => {
              const active = b.dataset.catId === selectedCategory;
              b.classList.toggle('active', active);
              b.style.background = active ? 'var(--primary-bg)' : 'transparent';
              b.style.color = active ? 'var(--primary)' : 'var(--text-secondary)';
              b.style.fontWeight = active ? '600' : 'normal';
            });
            // Update list
            const listEl = overlay.querySelector('#multi-select-list');
            if (listEl) {
              listEl.innerHTML = renderList();
              bindListEvents();
            }
          };
        });
      };

      const bindSearchEvents = () => {
        const searchInput = overlay.querySelector('#modal-search-input');
        if (!searchInput) return;
        searchInput.oninput = (e) => {
          searchKeyword = e.target.value.trim().toLowerCase();
          const listEl = overlay.querySelector('#multi-select-list');
          if (listEl) {
            listEl.innerHTML = renderList();
            bindListEvents();
          }
        };
      };

      bindListEvents();
      if (hasFilter) {
        bindCategoryEvents();
        bindSearchEvents();
      }
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

  // ========== Image Preview Modal ==========
  function previewImage(base64Url, event) {
    if (event) {
      event.stopPropagation();
    }
    const viewer = document.createElement('div');
    viewer.style.position = 'fixed';
    viewer.style.inset = '0';
    viewer.style.background = 'rgba(0,0,0,0.9)';
    viewer.style.zIndex = '3000';
    viewer.style.display = 'flex';
    viewer.style.alignItems = 'center';
    viewer.style.justifyContent = 'center';
    viewer.innerHTML = `
      <img src="${base64Url}" style="max-width:100vw; max-height:100vh; object-fit:contain; animation: zoomIn 0.25s ease-out;">
      <button style="position:absolute; top:20px; right:20px; color:white; font-size:30px; border:none; background:none; cursor:pointer;">&times;</button>
    `;
    viewer.onclick = () => { viewer.remove(); };
    document.body.appendChild(viewer);
  }

  // ========== Date Picker Modal (iOS Style Wheel) ==========
  function datePickerModal(title, defaultValue = '') {
    return new Promise(resolve => {
      let defaultDate = new Date();
      if (defaultValue) {
        const parts = defaultValue.split('-');
        if (parts.length === 3) {
          defaultDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        }
      }
      
      const initYear = defaultDate.getFullYear();
      const initMonth = defaultDate.getMonth() + 1;
      const initDay = defaultDate.getDate();

      const overlay = document.getElementById('modal-overlay');
      overlay.className = 'modal-overlay';
      overlay.classList.remove('hidden');

      const currentYear = new Date().getFullYear();
      const years = [];
      for (let y = currentYear - 5; y <= currentYear + 20; y++) {
        years.push(y);
      }
      const months = Array.from({ length: 12 }, (_, i) => i + 1);
      
      const getDaysInMonth = (y, m) => new Date(y, m, 0).getDate();

      overlay.innerHTML = `
        <div class="date-picker-modal">
          <div style="font-weight: 600; text-align: center; font-size: 16px; color: var(--text);">${title || '选择日期'}</div>
          <div class="date-picker-wheels">
            <div class="date-picker-mask"></div>
            <div class="date-picker-wheel" id="dp-wheel-year">
              ${years.map(y => `<div class="date-picker-item" data-val="${y}">${y}年</div>`).join('')}
            </div>
            <div class="date-picker-wheel" id="dp-wheel-month">
              ${months.map(m => `<div class="date-picker-item" data-val="${m}">${m}月</div>`).join('')}
            </div>
            <div class="date-picker-wheel" id="dp-wheel-day">
            </div>
          </div>
          <div class="date-picker-btns">
            <button class="date-picker-btn-cancel" id="dp-btn-cancel">取消</button>
            <button class="date-picker-btn-confirm" id="dp-btn-confirm">确定</button>
          </div>
        </div>
      `;

      const wheelYear = overlay.querySelector('#dp-wheel-year');
      const wheelMonth = overlay.querySelector('#dp-wheel-month');
      const wheelDay = overlay.querySelector('#dp-wheel-day');

      const updateDays = (selectedYear, selectedMonth, selectedDay) => {
        const daysCount = getDaysInMonth(selectedYear, selectedMonth);
        let html = '';
        for (let d = 1; d <= daysCount; d++) {
          html += `<div class="date-picker-item" data-val="${d}">${d}日</div>`;
        }
        wheelDay.innerHTML = html;
        
        const dVal = Math.min(selectedDay, daysCount);
        const dayIdx = dVal - 1;
        wheelDay.scrollTop = dayIdx * 40;
        updateSelectedClass(wheelDay);
      };

      const updateSelectedClass = (wheel) => {
        const idx = Math.round(wheel.scrollTop / 40);
        const items = wheel.querySelectorAll('.date-picker-item');
        items.forEach((item, i) => {
          if (i === idx) {
            item.classList.add('selected');
          } else {
            item.classList.remove('selected');
          }
        });
      };

      const yearIdx = years.indexOf(initYear);
      const monthIdx = months.indexOf(initMonth);
      
      setTimeout(() => {
        wheelYear.scrollTop = (yearIdx >= 0 ? yearIdx : 0) * 40;
        wheelMonth.scrollTop = (monthIdx >= 0 ? monthIdx : 0) * 40;
        updateDays(initYear, initMonth, initDay);
        
        updateSelectedClass(wheelYear);
        updateSelectedClass(wheelMonth);
      }, 50);

      let scrollTimeout;
      const onWheelScroll = (wheel, isYearOrMonth) => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          updateSelectedClass(wheel);
          if (isYearOrMonth) {
            const yIdx = Math.round(wheelYear.scrollTop / 40);
            const mIdx = Math.round(wheelMonth.scrollTop / 40);
            const y = years[yIdx] || currentYear;
            const m = months[mIdx] || 1;
            
            const dIdx = Math.round(wheelDay.scrollTop / 40);
            const d = dIdx + 1;
            updateDays(y, m, d);
          }
        }, 100);
      };

      wheelYear.onscroll = () => onWheelScroll(wheelYear, true);
      wheelMonth.onscroll = () => onWheelScroll(wheelMonth, true);
      wheelDay.onscroll = () => onWheelScroll(wheelDay, false);

      [wheelYear, wheelMonth, wheelDay].forEach((wheel) => {
        wheel.onclick = (e) => {
          const item = e.target.closest('.date-picker-item');
          if (item) {
            const idx = Array.from(wheel.children).indexOf(item);
            wheel.scrollTo({ top: idx * 40, behavior: 'smooth' });
          }
        };
      });

      overlay.querySelector('#dp-btn-cancel').onclick = () => {
        overlay.classList.add('hidden');
        resolve(null);
      };

      overlay.querySelector('#dp-btn-confirm').onclick = () => {
        const yIdx = Math.round(wheelYear.scrollTop / 40);
        const mIdx = Math.round(wheelMonth.scrollTop / 40);
        const dIdx = Math.round(wheelDay.scrollTop / 40);

        const y = years[yIdx] || currentYear;
        const m = months[mIdx] || 1;
        const d = dIdx + 1;
        const daysCount = getDaysInMonth(y, m);
        const finalDay = Math.min(d, daysCount);

        const pad = n => String(n).padStart(2, '0');
        const dateStr = `${y}-${pad(m)}-${pad(finalDay)}`;
        overlay.classList.add('hidden');
        resolve(dateStr);
      };
    });
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
    multiSelectModal,
    inputModal,
    empty,
    formatDate,
    formatDateTime,
    today,
    daysAgo,
    exportCSV,
    previewImage,
    datePickerModal
  };
})();
