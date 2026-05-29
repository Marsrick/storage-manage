/**
 * 商品管理页
 */
window.Pages = window.Pages || {};
window.Pages['/product'] = {
  render() {
    const products = Store.products.getAll();
    const categories = Store.categories.getAll();
    const catMap = {};
    categories.forEach(c => { catMap[c.id] = c.name; });

    return `
      <div class="page">
        ${UI.header('商品管理')}
        <div class="page-content has-footer-btn">
          <div style="padding-top:12px;">
            ${products.length === 0 ? UI.empty('暂无商品，请添加') : ''}
            <div class="manage-list">
              ${products.map(p => `
                <div class="manage-item" data-id="${p.id}" style="flex-direction:column;align-items:flex-start;gap:4px;position:relative;padding-right:40px;">
                  <span class="item-name">${p.name}</span>
                  <span style="font-size:12px;color:var(--text-secondary);">
                    分类: ${catMap[p.categoryId] || '无'} | 规格: ${p.spec || '-'} | 单位: ${p.unit || '-'}
                  </span>
                  <span style="font-size:12px;color:var(--text-secondary);">
                    货号: ${p.itemNo || '-'} | 厂家: ${p.manufacturer || '-'} | 安全库存: ${p.minStock || 0}
                  </span>
                  ${p.expiryDate ? `
                    <span style="font-size:12px;color:var(--text-secondary);">
                      有效期至: ${p.expiryDate}
                    </span>
                  ` : ''}
                  <button class="btn-more" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);"
                          onclick="Pages['/product'].onMore('${p.id}')">
                    ${UI.icon('more')}
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        <div class="footer-btn-fixed">
          <button class="btn-primary" onclick="Pages['/product'].onAdd()">新 增 商 品</button>
        </div>
      </div>
    `;
  },

  onAdd() {
    Router.navigate('/product-edit');
  },

  async onMore(id) {
    const idx = await UI.actionSheet([
      { label: '编辑' },
      { label: '删除', danger: true }
    ]);
    if (idx === 0) {
      Router.navigate('/product-edit?id=' + id);
    } else if (idx === 1) {
      const ok = await UI.confirm('确定删除该商品？');
      if (ok) {
        Store.products.remove(id);
        UI.toast('删除成功', 'success');
        Router.refresh();
      }
    }
  }
};

// 商品编辑/新增页
window.Pages['/product-edit'] = {
  _form: {},

  render() {
    const params = Router.getParams();
    const isEdit = !!params.id;
    const product = isEdit ? Store.products.getById(params.id) : null;
    const categories = Store.categories.getAll();

    this._form = product ? { ...product } : {
      name: '', categoryId: '', unit: '', barcode: '',
      minStock: '', expiryDate: '', spec: '', itemNo: '', manufacturer: ''
    };

    const catName = this._form.categoryId
      ? (Store.categories.getById(this._form.categoryId) || {}).name || ''
      : '';

    return `
      <div class="page">
        ${UI.header(isEdit ? '编辑商品' : '新增商品')}
        <div class="page-content">
          <div class="card" style="margin-top:12px;">
            <div class="form-group">
              <span class="form-label">名称 <span class="required">*</span></span>
              <div class="form-value">
                <input class="form-input" id="f-name" placeholder="请输入商品名称" value="${this._form.name}">
              </div>
            </div>
            <div class="form-group">
              <span class="form-label">货号</span>
              <div class="form-value">
                <input class="form-input" id="f-itemNo" placeholder="请输入货号" value="${this._form.itemNo || ''}">
              </div>
            </div>
            <div class="form-group">
              <span class="form-label">厂家</span>
              <div class="form-value">
                <input class="form-input" id="f-manufacturer" placeholder="请输入厂家名称" value="${this._form.manufacturer || ''}">
              </div>
            </div>
            <div class="form-group">
              <span class="form-label">分类</span>
              <div class="form-value" id="f-category-btn" style="cursor:pointer;">
                <span class="form-select-value ${catName ? '' : 'placeholder'}" id="f-category-text">
                  ${catName || '请选择分类'}
                </span>
                <span class="form-arrow">›</span>
              </div>
            </div>
            <div class="form-group">
              <span class="form-label">单位</span>
              <div class="form-value">
                <input class="form-input" id="f-unit" placeholder="如: 瓶、箱、个" value="${this._form.unit || ''}">
              </div>
            </div>
            <div class="form-group">
              <span class="form-label">条码</span>
              <div class="form-value">
                <input class="form-input" id="f-barcode" placeholder="商品条码" value="${this._form.barcode || ''}">
              </div>
            </div>
            <div class="form-group">
              <span class="form-label">规格</span>
              <div class="form-value">
                <input class="form-input" id="f-spec" placeholder="如: 500ml/瓶" value="${this._form.spec || ''}">
              </div>
            </div>
            <div class="form-group">
              <span class="form-label">安全库存</span>
              <div class="form-value">
                <input class="form-input" id="f-minStock" type="number" placeholder="0" value="${this._form.minStock || ''}">
              </div>
            </div>
            <div class="form-group">
              <span class="form-label">有效期截至</span>
              <div class="form-value">
                <input class="form-input" id="f-expiryDate" type="date" value="${this._form.expiryDate || ''}">
              </div>
            </div>
          </div>
          <button class="btn-primary" onclick="Pages['/product-edit'].onSubmit()">提 交</button>
        </div>
      </div>
    `;
  },

  afterRender() {
    document.getElementById('f-category-btn').onclick = async () => {
      const categories = Store.categories.getAll();
      const options = [
        { label: '不选择', value: '' },
        ...categories.map(c => ({ label: c.name, value: c.id }))
      ];
      const val = await UI.selectModal('选择分类', options, this._form.categoryId);
      if (val !== null) {
        this._form.categoryId = val;
        const text = document.getElementById('f-category-text');
        const cat = Store.categories.getById(val);
        text.textContent = cat ? cat.name : '请选择分类';
        text.className = `form-select-value ${cat ? '' : 'placeholder'}`;
      }
    };
  },

  onSubmit() {
    const name = document.getElementById('f-name').value.trim();
    if (!name) {
      UI.toast('请输入商品名称', 'error');
      return;
    }

    const data = {
      name,
      itemNo: document.getElementById('f-itemNo').value.trim(),
      manufacturer: document.getElementById('f-manufacturer').value.trim(),
      categoryId: this._form.categoryId || '',
      unit: document.getElementById('f-unit').value.trim(),
      barcode: document.getElementById('f-barcode').value.trim(),
      spec: document.getElementById('f-spec').value.trim(),
      minStock: parseInt(document.getElementById('f-minStock').value) || 0,
      expiryDate: document.getElementById('f-expiryDate').value || ''
    };

    const params = Router.getParams();
    if (params.id) {
      Store.products.update(params.id, data);
      UI.toast('修改成功', 'success');
    } else {
      Store.products.add(data);
      UI.toast('添加成功', 'success');
    }
    Router.back();
  }
};
