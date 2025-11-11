import React from 'react';
import TemplateSimple from './TemplateSimple'; // <-- Sắp tạo (File 4/6)
import TemplateVip from './TemplateVip';       // <-- Sắp tạo (File 5/6)

// File này là "bộ chuyển" (switcher)
const CVPreview = ({ data, template }) => {

  // Logic: "Bộ não" (File 1/6) bảo "template"
  // là gì, thì nó "render" (hiển thị) cái đó.
  
  switch (template) {
    case 'vip':
      return <TemplateVip data={data} />;
      
    case 'simple':
      return <TemplateSimple data={data} />;
      
    default:
      // Mặc định là mẫu "Đơn giản"
      return <TemplateSimple data={data} />;
  }
};

export default CVPreview;