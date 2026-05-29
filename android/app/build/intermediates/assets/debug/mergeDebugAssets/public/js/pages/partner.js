/**
 * 往来单位管理页
 */
window.Pages = window.Pages || {};
window.Pages['/partner'] = {
  render() {
    const partners = Store.partners.getAll();
    return `
      <div class="page">
        ${UI.header('往来单位')}
        <div class="page-content has-footer-btn">
          <div style="padding-top:12px;">
            ${partners.length === 0 ? UI.empty('暂无往来单位，请添加') : ''}
            <div class="manage-list">
              ${partners.map(p => `
                <div class="manage-item" data-id="${p.id}" style="flex-direction:column;align-items:flex-start;gap:4px;position:relative;">
                  <span class="item-name" style="padding-right:32px;">${p.name}</span>
                  <span style="font-size:12px;color:var(--text-secondary);">
                    ${p.type === 'supplier' ? '供应商' : '客户'}
                    ${p.contact ? ` | 联系人: ${p.contact}` : ''}
                    ${p.phone ? ` | ${p.phone}` : ''}
                  </span>
                  <button class="btn-more" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);"
                          onclick="Pages['/partner'].onMore('${p.id}')">
                    ${UI.icon('more')}
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        <div class="footer-btn-fixed">
          <button class="btn-primary" onclick="Pages['/partner'].onAdd()">新 增 往 来 单 位</button>
        </div>
      </div>
    `;
  },

  onAdd() {
    Router.navigate('/partner-edit');
  },

  async onMore(id) {
    const idx = await UI.actionSheet([
      { label: '编辑' },
      { label: '删除', danger: true }
    ]);
    if (idx === 0) {
      Router.navigate('/partner-edit?id=' + id);
    } else if (idx === 1) {
      const ok = await UI.confirm('确定删除该往来单位？');
      if (ok) {
        Store.partners.remove(id);
        UI.toast('删除成功', 'success');
        Router.refresh();
      }
    }
  }
};

// 往来单位编辑页
window.Pages['/partner-edit'] = {
  _form: {},

  render() {
    const params = Router.getParams();
    const isEdit = !!params.id;
    const partner = isEdit ? Store.partners.getById(params.id) : null;

    this._form = partner ? { ...partner } : {
      name: '', type: 'supplier', contact: '', phone: ''
    };

    return `
      <div class="page">
        ${UI.header(isEdit ? '编辑往来单位' : '新增往来单位')}
        <div class="page-content">
          <div class="card" style="margin-top:12px;">
            <div class="form-group">
              <span class="form-label">名称 <span class="required">*</span></span>
              <div class="form-value">
                <input class="form-input" id="f-name" placeholder="请输入单位名称" value="${this._form.name}">
              </div>
            </div>
            <div class="form-group">
              <span class="form-label">类型</span>
              <div class="form-value" id="f-type-btn" style="cursor:pointer;">
                <span class="form-select-value" id="f-type-text">
                  ${this._form.type === 'supplier' ? '供应商' : '客户'}
                </span>
                <span class="form-arrow">›</span>
              </div>
            </div>
            <div class="form-group">
              <span class="form-label">联系人</span>
              <div class="form-value">
                <input class="form-input" id="f-contact" placeholder="联系人姓名" value="${this._form.contact || ''}">
              </div>
            </div>
            <div class="form-group">
              <span class="form-label">电话</span>
              <div class="form-value">
                <input class="form-input" id="f-phone" type="tel" placeholder="联系电话" value="${this._form.phone || ''}">
              </div>
            </div>
          </div>
          <button class="btn-primary" onclick="Pages['/partner-edit'].onSubmit()">提 交</button>
        </div>
      </div>
    `;
  },

  afterRender() {
    document.getElementById('f-type-btn').onclick = async () => {
      const options = [
        { label: '供应商', value: 'supplier' },
        { label: '客户', value: 'customer' }
      ];
      const val = await UI.selectModal('选择类型', options, this._form.type);
      if (val) {
        this._form.type = val;
        document.getElementById('f-type-text').textContent = val === 'supplier' ? '供应商' : '客户';
      }
    };
  },

  onSubmit() {
    const name = document.getElementById('f-name').value.trim();
    if (!name) {
      UI.toast('请输入单位名称', 'error');
      return;
    }

    const data = {
      name,
      type: this._form.type || 'supplier',
      contact: document.getElementById('f-contact').value.trim(),
      phone: document.getElementById('f-phone').value.trim()
    };

    const params = Router.getParams();
    if (params.id) {
      Store.partners.update(params.id, data);
      UI.toast('修改成功', 'success');
    } else {
      Store.partners.add(data);
      UI.toast('添加成功', 'success');
    }
    Router.back();
  }
};
