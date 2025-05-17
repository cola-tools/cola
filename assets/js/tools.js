/**
 * 小可乐工具箱 - 工具页JavaScript
 * 包含工具页的特定功能和交互逻辑
 */

document.addEventListener('DOMContentLoaded', function() {
    // 工具搜索功能
    initToolSearch();
    
    // 工具分类切换
    initToolCategories();
    
    // 工具卡片点击效果
    initToolCardClick();
});

/**
 * 初始化工具搜索功能
 */
function initToolSearch() {
    const searchInput = document.getElementById('tool-search');
    const toolCards = document.querySelectorAll('.tool-card');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.trim().toLowerCase();
            
            toolCards.forEach(card => {
                const title = card.querySelector('.tool-title').textContent.toLowerCase();
                const desc = card.querySelector('.tool-desc').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || desc.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

/**
 * 初始化工具分类切换
 */
function initToolCategories() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const toolCards = document.querySelectorAll('.tool-card');
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 更新活动标签
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            
            // 筛选工具
            toolCards.forEach(card => {
                if (category === 'all' || card.dataset.categories.includes(category)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/**
 * 初始化工具卡片点击效果
 */
function initToolCardClick() {
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // 防止点击按钮或链接时触发卡片点击
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                return;
            }
            
            // 这里可以添加工具点击后的逻辑，比如打开工具详情页
            const toolTitle = this.querySelector('.tool-title').textContent;
            console.log(`打开工具: ${toolTitle}`);
            
            // 临时效果 - 点击动画
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
}

/**
 * 加载更多工具
 */
function loadMoreTools() {
    const loader = showLoading(document.querySelector('.all-tools .container'));
    
    // 模拟异步加载
    setTimeout(() => {
        // 这里应该是AJAX请求获取更多工具数据
        console.log('加载更多工具...');
        
        hideLoading(loader);
    }, 1000);
}