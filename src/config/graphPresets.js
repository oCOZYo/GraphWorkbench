export const INITIAL_NODE_TYPES = {
  AGENT: { label: '代理人', color: '#ef4444', icon: '👤', keywords: ['代理', '经纪', '某某', '首脑'], prefix: 'DL' },
  MEMBER: { label: '投保人', color: '#f97316', icon: '👨', keywords: ['投保', '被保险', '成员', '客户'], prefix: 'TB' },
  POLICY: { label: '保单', color: '#3b82f6', icon: '📄', keywords: ['保单', '合同', '契约'], prefix: 'BD' },
  INVOICE: { label: '发票', color: '#f59e0b', icon: '🧾', keywords: ['发票', '凭证', '单据', '收据'], prefix: 'FP' },
  INSURER: { label: '保险公司', color: '#8b5cf6', icon: '🏢', keywords: ['保司', '保险公司', '分公司'], prefix: 'BS' },
  HOSPITAL: { label: '医疗机构', color: '#10b981', icon: '🏥', keywords: ['医院', '诊疗', '门诊', '卫生院'], prefix: 'YY' },
}

export const INITIAL_LINK_TYPES = [
  { name: '代理销售', color: '#3b82f6', style: 'solid', weight: 1.5 },
  { name: '被保险', color: '#94a3b8', style: 'solid', weight: 1.5 },
  { name: '提交凭证', color: '#f59e0b', style: 'solid', weight: 1.5 },
  { name: '承保', color: '#8b5cf6', style: 'solid', weight: 1.5 },
  { name: '垫付保费', color: '#ef4444', style: 'solid', weight: 1.5 },
  { name: '资金回流', color: '#dc2626', style: 'solid', weight: 1.5 },
  { name: '住院就诊', color: '#10b981', style: 'solid', weight: 1.5 },
  { name: '重复理赔', color: '#7c3aed', style: 'solid', weight: 1.5 },
]
