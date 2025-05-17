document.addEventListener('DOMContentLoaded', function() {
    // 为表格行添加动画效果
    const tableRows = document.querySelectorAll('.donation-table tbody tr');
    
    tableRows.forEach((row, index) => {
        // 延迟显示每一行
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        row.style.transition = `all 0.3s ease ${index * 0.1}s`;
        
        // 使用requestAnimationFrame确保样式应用
        requestAnimationFrame(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        });
    });
    
    // 点击行时的效果
    tableRows.forEach(row => {
        row.addEventListener('click', function() {
            this.style.backgroundColor = '#f0f7ff';
            setTimeout(() => {
                this.style.backgroundColor = '';
            }, 300);
        });
    });
});