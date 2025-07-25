/**
 * 设备检测和适配模块
 */

import { animationConfig } from './theme.js';

// 统一断点系统 - 单一断点值
const BREAKPOINT = 1024;

const getDeviceType = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // 手机设备（包括横屏）优先使用移动端样式
    if (isTouchDevice && (width < BREAKPOINT || height < 600)) {
        return 'mobile';
    }
    
    return width < BREAKPOINT ? 'mobile' : 'desktop';
};

const isMobileDevice = () => getDeviceType() === 'mobile';
const isDesktopDevice = () => getDeviceType() === 'desktop';
const shouldCollapseSidebar = () => getDeviceType() === 'mobile';

// 更新侧边栏状态的函数
const updateSidebarVisibility = (sidebar, isCollapsed, skipAnimation = false) => {
    sidebar.classList.toggle('collapsed', isCollapsed);
    const toggleButton = document.getElementById('toggle-sidebar');
    const showPanel = toggleButton.querySelector('.show-panel');
    const hidePanel = toggleButton.querySelector('.hide-panel');
    showPanel.style.display = isCollapsed ? 'block' : 'none';
    hidePanel.style.display = isCollapsed ? 'none' : 'block';

    const folderElements = sidebar.querySelectorAll('.folder');
    if (folderElements && folderElements.length > 0) {
        if (isCollapsed) {
            gsap.set(folderElements, { opacity: 0, visibility: 'hidden' });
        } else if (!skipAnimation) {
            gsap.set(folderElements, { opacity: 0, visibility: 'visible' });
            folderElements.forEach((folder, index) => {
                gsap.to(folder, {
                    opacity: 1,
                    delay: index * 0.05,
                    duration: animationConfig.duration.medium,
                    ease: animationConfig.ease.outQuad
                });
            });
        } else {
            gsap.set(folderElements, { opacity: 1, visibility: 'visible' });
        }
    }
};

// 检查面包屑导航是否可滚动
const checkBreadcrumbsScroll = () => {
    const breadcrumbs = document.getElementById('breadcrumbs');
    if (!breadcrumbs) return;
    
    const isScrollable = breadcrumbs.scrollWidth > breadcrumbs.clientWidth;
    breadcrumbs.classList.toggle('scrollable', isScrollable);
};

// 调整主页消息位置
const adjustHomeMessagePosition = (isCollapsed) => {
    const homeMessage = document.querySelector('.home-message');
    if (!homeMessage) return;

    const deviceType = getDeviceType();
    if (deviceType === 'mobile') {
        // 移动端始终居中
        homeMessage.style.left = '50%';
        homeMessage.style.transform = 'translate(-50%, -50%)';
        homeMessage.style.top = '45%';
    } else {
        // PC端根据侧边栏状态调整
        homeMessage.style.left = '';
        homeMessage.style.transform = '';
        homeMessage.style.top = '';
    }
};

// 调整搜索容器位置和偏移量
const adjustSearchContainerPosition = () => {
    const searchContainer = document.querySelector('.search-container');
    const searchInput = document.getElementById('search-input');
    if (!searchContainer || !searchInput) return;

    requestAnimationFrame(() => {
        const deviceType = getDeviceType();
        if (deviceType === 'mobile') {
            searchContainer.style.removeProperty('--search-container-centering-offset');
            return;
        }

        const searchInputOffsetLeft = searchInput.offsetLeft;
        const searchInputWidth = searchInput.offsetWidth;
        const searchContainerWidth = searchContainer.offsetWidth;
        
        const shiftInPx = (searchContainerWidth / 2) - (searchInputOffsetLeft + searchInputWidth / 2);
        
        if (shiftInPx !== 0) {
            searchContainer.style.setProperty('--search-container-centering-offset', `${shiftInPx}px`);
        }
    });
};

// 封装侧边栏状态管理
const updateSidebarState = (sidebar, isCollapsed, skipAnimation = false) => {
    updateSidebarVisibility(sidebar, isCollapsed, skipAnimation);
    adjustHomeMessagePosition(isCollapsed);
    checkBreadcrumbsScroll();
};

const handleDeviceView = () => {
    const sidebar = document.querySelector('.sidebar');
    const deviceType = getDeviceType();
    const shouldCollapse = shouldCollapseSidebar();
    
    document.body.classList.toggle('mobile-device', deviceType === 'mobile');
    document.body.classList.toggle('desktop-device', deviceType === 'desktop');
    
    // 视口变化时跳过动画，避免重新渲染
    updateSidebarState(sidebar, shouldCollapse, true);
};

export {
    BREAKPOINT,
    getDeviceType,
    isMobileDevice,
    isDesktopDevice,
    shouldCollapseSidebar,
    updateSidebarVisibility,
    checkBreadcrumbsScroll,
    adjustHomeMessagePosition,
    adjustSearchContainerPosition,
    updateSidebarState,
    handleDeviceView
};