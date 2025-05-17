/**
 * 小可乐工具箱 - 主JavaScript文件
 * 包含网站的核心功能和交互逻辑
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化粒子背景
    initParticles();
    
    // 移动端菜单切换
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    if (mobileMenuBtn && navbarMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navbarMenu.classList.toggle('active');
            this.querySelector('i').classList.toggle('fa-times');
            this.querySelector('i').classList.toggle('fa-bars');
        });
    }
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 当前页面高亮
    highlightCurrentPage();
    
    // 工具卡片悬停效果
    initToolCardsHover();
    
    // 初始化动画
    initAnimations();
});

/**
 * 初始化粒子背景
 */
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: "#4a6bff"
                },
                shape: {
                    type: "circle",
                    stroke: {
                        width: 0,
                        color: "#000000"
                    },
                    polygon: {
                        nb_sides: 5
                    }
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: {
                        enable: false,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 40,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#4a6bff",
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: false,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: true,
                        mode: "grab"
                    },
                    onclick: {
                        enable: true,
                        mode: "push"
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 0.5
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
    }
}

/**
 * 高亮当前页面菜单项
 */
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const link = item.querySelector('a');
        if (link) {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        }
    });
}

/**
 * 初始化工具卡片悬停效果
 */
function initToolCardsHover() {
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.tool-icon i');
            if (icon) {
                icon.style.transform = 'scale(1.1)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.tool-icon i');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });
}

/**
 * 初始化动画效果
 */
function initAnimations() {
    // 使用Intersection Observer实现滚动动画
    const observerOptions = {
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    document.querySelectorAll('.announcement-card, .section-title, .tool-card').forEach(el => {
        observer.observe(el);
    });
}

/**
 * 显示加载动画
 * @param {HTMLElement} element - 要显示加载动画的容器
 */
function showLoading(element) {
    const loader = document.createElement('div');
    loader.className = 'loading-spinner';
    element.appendChild(loader);
    return loader;
}

/**
 * 隐藏加载动画
 * @param {HTMLElement} loader - 加载动画元素
 */
function hideLoading(loader) {
    if (loader && loader.parentNode) {
        loader.parentNode.removeChild(loader);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('intro-video');
    const contextMenu = document.getElementById('video-context-menu');
    
    // 右键菜单功能
    video.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        
        // 设置菜单位置
        const x = e.clientX;
        const y = e.clientY;
        
        contextMenu.style.display = 'block';
        contextMenu.style.left = `${x}px`;
        contextMenu.style.top = `${y}px`;
        
        // 点击其他地方关闭菜单
        const closeMenu = function() {
            contextMenu.style.display = 'none';
            document.removeEventListener('click', closeMenu);
        };
        
        document.addEventListener('click', closeMenu);
    });
    
    // 右键菜单项点击事件
    const menuItems = document.querySelectorAll('.context-menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const videoInfo = {
                title: '小可乐工具箱介绍视频',
                url: window.location.origin + '/assets/videos/intro.mp4',
                size: '15.8 MB',
                duration: '1分32秒',
                resolution: '1280x720',
                format: 'MP4'
            };
            
            switch(this.textContent.trim()) {
                case '视频信息':
                    alert(`标题: ${videoInfo.title}\n时长: ${videoInfo.duration}\n分辨率: ${videoInfo.resolution}\n格式: ${videoInfo.format}`);
                    break;
                case '视频URL':
                    alert(`视频URL: ${videoInfo.url}`);
                    break;
                case '视频大小':
                    alert(`视频大小: ${videoInfo.size}`);
                    break;
                case '自定义设置':
                    alert('自定义设置功能正在开发中');
                    break;
            }
            
            contextMenu.style.display = 'none';
        });
    });
    
    // 禁用视频右键菜单的复制功能
    contextMenu.addEventListener('copy', function(e) {
        e.preventDefault();
        return false;
    });
    
    // 禁用视频右键菜单的文本选择
    contextMenu.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // 禁用视频下载
    video.addEventListener('keydown', function(e) {
        if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
            e.preventDefault();
            return false;
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('tutorial-video');
    const pipBtn = document.getElementById('pip-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    
    // 画中画模式
    if (document.pictureInPictureEnabled) {
        pipBtn.addEventListener('click', function() {
            if (document.pictureInPictureElement) {
                document.exitPictureInPicture()
                    .catch(error => console.error('退出画中画失败:', error));
            } else {
                video.requestPictureInPicture()
                    .catch(error => console.error('进入画中画失败:', error));
            }
        });
    } else {
        pipBtn.style.display = 'none';
    }
    
    // 全屏模式
    fullscreenBtn.addEventListener('click', function() {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) {
            video.msRequestFullscreen();
        }
    });
    
    // 禁用视频下载
    video.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    video.addEventListener('keydown', function(e) {
        if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
            e.preventDefault();
            return false;
        }
    });
});

// 关于我们页面视频控制
document.addEventListener('DOMContentLoaded', function() {
    const aboutVideo = document.getElementById('about-video');
    const pipBtn = document.getElementById('about-pip-btn');
    const fullscreenBtn = document.getElementById('about-fullscreen-btn');
    
    if (aboutVideo) {
        // 画中画模式
        if (document.pictureInPictureEnabled) {
            pipBtn.addEventListener('click', function() {
                if (document.pictureInPictureElement) {
                    document.exitPictureInPicture()
                        .catch(error => console.error('退出画中画失败:', error));
                } else {
                    aboutVideo.requestPictureInPicture()
                        .catch(error => console.error('进入画中画失败:', error));
                }
            });
        } else {
            pipBtn.style.display = 'none';
        }
        
        // 全屏模式
        fullscreenBtn.addEventListener('click', function() {
            if (aboutVideo.requestFullscreen) {
                aboutVideo.requestFullscreen();
            } else if (aboutVideo.webkitRequestFullscreen) {
                aboutVideo.webkitRequestFullscreen();
            } else if (aboutVideo.msRequestFullscreen) {
                aboutVideo.msRequestFullscreen();
            }
        });
        
        // 禁用视频下载
        aboutVideo.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
        
        aboutVideo.addEventListener('keydown', function(e) {
            if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
                e.preventDefault();
                return false;
            }
        });
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const btn = document.querySelector('.friend-links-btn');
    const dropdown = document.getElementById('friendLinksDropdown');
    
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdown.classList.toggle('show');
    });
    
    // 点击页面其他区域关闭下拉菜单
    document.addEventListener('click', function() {
        dropdown.classList.remove('show');
    });
    
    // 阻止下拉菜单内部的点击事件冒泡
    dropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });
});
