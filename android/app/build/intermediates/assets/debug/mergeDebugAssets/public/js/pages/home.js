/**
 * 首页
 */
window.Pages = window.Pages || {};
window.Pages['/'] = {
  render() {
    const settings = Store.getSettings();
    const stats = Store.getTodayStats();

    return `
      <div class="page">
        <header class="home-header">
          <h1 class="header-title">出入库管理系统</h1>
          <div class="home-header-actions">
            <button onclick="Router.navigate('/settings')">${UI.icon('more')}</button>
            <button onclick="Router.navigate('/settings')">${UI.icon('settings')}</button>
          </div>
        </header>

        <div class="page-content has-tabbar">
          <!-- 今日统计 -->
          <div class="stats-card anim-slide-up">
            <div class="group-name">${settings.groupName}</div>
            <div class="stats-row">
              <div class="stats-col">
                <div class="stats-label">今日入库 <span class="arrow">›</span></div>
                <div class="stats-values">
                  <span class="stat-item">单数: <span class="num">${stats.inCount}</span></span>
                  <span class="stat-item">数量: <span class="num">${stats.inQty}</span></span>
                </div>
              </div>
              <div class="stats-col">
                <div class="stats-label">今日出库 <span class="arrow">›</span></div>
                <div class="stats-values">
                  <span class="stat-item">单数: <span class="num">${stats.outCount}</span></span>
                  <span class="stat-item">数量: <span class="num">${stats.outQty}</span></span>
                </div>
              </div>
            </div>
          </div>

          <!-- 操作 -->
          <div class="section">
            <div class="section-header">
              <div class="section-title">操作</div>
            </div>
            <div class="icon-grid">
              ${gridItem('stockIn', '入库', '/', () => "Router.navigate('/stock-in')")}
              ${gridItem('stockOut', '出库', '/', () => "Router.navigate('/stock-out')")}
              ${gridItem('transfer', '调拨', 'disabled')}
              ${gridItem('check', '盘点', 'disabled')}
            </div>
          </div>

          <!-- 记录 -->
          <div class="section">
            <div class="section-header">
              <div class="section-title">记录</div>
            </div>
            <div class="icon-grid">
              ${gridItem('docIn', '入库单', 'green', () => "Router.navigate('/stock-in-records')")}
              ${gridItem('docOut', '出库单', 'green', () => "Router.navigate('/stock-out-records')")}
              ${gridItem('docTransfer', '调拨单', 'disabled')}
              ${gridItem('docCheck', '盘点单', 'disabled')}
            </div>
          </div>

          <!-- 库存 -->
          <div class="section">
            <div class="section-header">
              <div class="section-title">库存</div>
            </div>
            <div class="icon-grid">
              ${gridItem('inventory', '库存查询', 'teal', () => "Router.navigate('/inventory')")}
              ${gridItem('alertIcon', '库存预警', 'orange', () => "Router.navigate('/stock-alert')")}
              ${gridItem('expiry', '过期预警', 'red', () => "Router.navigate('/expiry-alert')")}
              ${gridItem('chart', '统计分析', 'purple', () => "Router.navigate('/stats')")}
            </div>
          </div>

          <!-- 基础数据设置 -->
          <div class="section">
            <div class="section-header">
              <div class="section-title">基础数据设置</div>
            </div>
            <div class="icon-grid">
              ${gridItem('warehouse', '仓库管理', '/', () => "Router.navigate('/warehouse')")}
              ${gridItem('category', '商品分类', '/', () => "Router.navigate('/category')")}
              ${gridItem('product', '商品管理', '/', () => "Router.navigate('/product')")}
              ${gridItem('partner', '往来单位', '/', () => "Router.navigate('/partner')")}
            </div>
          </div>
        </div>

        ${UI.tabbar('home')}
      </div>
    `;
  }
};

function gridItem(iconName, label, colorOrClass, onClickFn) {
  const isDisabled = colorOrClass === 'disabled';
  const colorClass = (!isDisabled && colorOrClass !== '/') ? colorOrClass : '';
  const onclick = isDisabled ? '' : `onclick="${onClickFn ? onClickFn() : ''}"`;
  return `
    <div class="icon-grid-item ${isDisabled ? 'disabled' : ''}" ${onclick}>
      <div class="icon-circle ${colorClass}">
        ${UI.icon(iconName)}
      </div>
      <span class="icon-label">${label}</span>
    </div>
  `;
}
