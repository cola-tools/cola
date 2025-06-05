// 照片存储系统 - 整合所有功能

// ===== 基础工具函数 =====

// 计算数据的SHA-256哈希值
async function calculateSHA256(data) {
  const encoder = new TextEncoder();
  const dataBuffer = typeof data === 'string' ? encoder.encode(data) : data;
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

// 图片压缩
async function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = function() {
      // 计算新尺寸
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = height * (maxWidth / width);
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = width * (maxHeight / height);
        height = maxHeight;
      }
      
      // 创建canvas并绘制图像
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      // 将canvas内容转换为Blob
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        file.type || 'image/jpeg',
        quality
      );
    };
    
    img.onerror = function() {
      reject(new Error('图片加载失败'));
    };
  });
}

// ===== IndexedDB数据库操作 =====

// 初始化数据库
async function initDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('classPhotosDB', 3);
    
    request.onupgradeneeded = function(event) {
      const db = event.target.result;
      
      // 如果存在旧的objectStore，则删除
      if (db.objectStoreNames.contains('photos')) {
        db.deleteObjectStore('photos');
      }
      
      // 创建新的objectStore
      const objectStore = db.createObjectStore('photos', { keyPath: 'id', autoIncrement: true });
      // 添加必要的索引
      objectStore.createIndex('caption', 'caption', { unique: false });
      objectStore.createIndex('uploadDate', 'uploadDate', { unique: false });
      objectStore.createIndex('hash', 'hash', { unique: false });
    };
    
    request.onsuccess = function(event) {
      resolve(event.target.result);
    };
    
    request.onerror = function(event) {
      reject(event.target.error);
    };
  });
}

// 保存照片
async function savePhoto(file, caption) {
  try {
    // 压缩图片
    const compressedBlob = await compressImage(file);
    
    // 转换为DataURL
    const reader = new FileReader();
    const dataUrl = await new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(compressedBlob);
    });
    
    // 计算DataURL的哈希值
    const hash = await calculateSHA256(dataUrl);
    
    // 获取数据库
    const db = await initDatabase();
    
    // 创建事务并保存照片
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['photos'], 'readwrite');
      const objectStore = transaction.objectStore('photos');
      
      const photoData = {
        dataUrl: dataUrl,
        caption: caption || '青春记忆',
        uploadDate: new Date().toISOString(),
        hash: hash
      };
      
      const request = objectStore.add(photoData);
      
      request.onsuccess = function(event) {
        resolve({ id: event.target.result, ...photoData });
      };
      
      request.onerror = function(event) {
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('保存照片失败:', error);
    throw error;
  }
}

// 获取照片
async function getPhotosByPage(page = 1, pageSize = 20) {
  try {
    const db = await initDatabase();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['photos'], 'readonly');
      const objectStore = transaction.objectStore('photos');
      
      // 获取总记录数
      const countRequest = objectStore.count();
      countRequest.onsuccess = function() {
        const totalCount = countRequest.result;
        const totalPages = Math.ceil(totalCount / pageSize);
        
        // 创建游标，跳过前面的记录
        const skip = (page - 1) * pageSize;
        const request = objectStore.openCursor(null, 'prev'); // 按时间倒序排列，最新的在前
        const results = [];
        let count = 0;
        
        request.onsuccess = function(event) {
          const cursor = event.target.result;
          if (cursor) {
            if (count >= skip && results.length < pageSize) {
              results.push(cursor.value);
            }
            count++;
            
            if (results.length < pageSize) {
              cursor.continue();
            } else {
              resolve({
                photos: results,
                totalPages: totalPages,
                currentPage: page
              });
            }
          } else {
            resolve({
              photos: results,
              totalPages: totalPages,
              currentPage: page
            });
          }
        };
        
        request.onerror = function(event) {
          reject(event.target.error);
        };
      };
      
      countRequest.onerror = function(event) {
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('分页获取照片失败:', error);
    throw error;
  }
}

// 验证照片完整性
async function verifyPhotoIntegrity(photo) {
  try {
    // 重新计算哈希值
    const recalculatedHash = await calculateSHA256(photo.dataUrl);
    
    // 比较哈希值
    return recalculatedHash === photo.hash;
  } catch (error) {
    console.error('验证照片完整性失败:', error);
    return false;
  }
}


// ===== 界面交互功能 =====

// 初始化延迟加载
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const image = entry.target;
          image.src = image.dataset.src;
          image.classList.remove('lazy-image');
          imageObserver.unobserve(image);
        }
      });
    });
    
    lazyImages.forEach(image => {
      imageObserver.observe(image);
    });
  } else {
    // 回退方案 - 一次性加载所有图片
    lazyImages.forEach(image => {
      image.src = image.dataset.src;
      image.classList.remove('lazy-image');
    });
  }
}

// ===== 初始化函数 =====


// 模拟后端提供的照片路径数组
const photoPaths = [
    'assests/images/BJ/qcc(1).jpg',
    'assests/images/BJ/qcc(2).jpg',
    'assests/images/BJ/qcc(3).jpg',
    'assests/images/BJ/qcc(4).jpg',
    'assests/images/BJ/qcc(5).jpg',
    'assests/images/BJ/qcc(6).jpg',
    'assests/images/BJ/qcc(7).jpg',
    'assests/images/BJ/qcc(8).jpg',
    'assests/images/BJ/qcc(9).jpg',
    'assests/images/BJ/qcc(10).jpg',
    'assests/images/BJ/qcc(11).jpg',
    'assests/images/BJ/qcc(12).jpg',
    'assests/images/BJ/qcc(13).jpg',
    'assests/images/BJ/qcc(14).jpg',
    'assests/images/BJ/qcc(15).jpg',
    'assests/images/BJ/qcc(16).jpg',
    'assests/images/BJ/qcc(17).jpg',
    'assests/images/BJ/qcc(18).jpg',
    'assests/images/BJ/qcc(19).jpg',
    'assests/images/BJ/qcc(20).jpg',
    'assests/images/BJ/qcc(21).jpg',
    'assests/images/BJ/qcc(22).jpg',
    'assests/images/BJ/qcc(23).jpg',
    'assests/images/BJ/qcc(24).jpg',
    'assests/images/BJ/qcc(25).jpg',
    'assests/images/BJ/qcc(26).jpg',
    'assests/images/BJ/qcc(27).jpg',
    'assests/images/BJ/qcc(28).jpg',
    'assests/images/BJ/qcc(29).jpg',
    'assests/images/BJ/qcc(30).jpg',
    'assests/images/BJ/qcc(31).jpg',
    'assests/images/BJ/qcc(32).jpg',
    'assests/images/BJ/qcc(33).jpg',
    'assests/images/BJ/qcc(34).jpg',
    'assests/images/BJ/qcc(35).jpg',
    'assests/images/BJ/qcc(36).jpg',
    'assests/images/BJ/qcc(37).jpg',
    'assests/images/BJ/qcc(38).jpg',
    'assests/images/BJ/qcc(39).jpg',
    'assests/images/BJ/qcc(40).jpg',
    'assests/images/BJ/qcc(41).jpg',
    'assests/images/BJ/qcc(42).jpg',
    'assests/images/BJ/qcc(43).jpg',
    'assests/images/BJ/qcc(44).jpg',
    'assests/images/BJ/qcc(45).jpg',
    'assests/images/BJ/qcc(46).jpg',
    'assests/images/BJ/qcc(47).jpg',
    'assests/images/BJ/qcc(48).jpg',
    'assests/images/BJ/qcc(49).jpg',
    'assests/images/BJ/qcc(50).jpg',
    'assests/images/BJ/qcc(51).jpg',
    'assests/images/BJ/qcc(52).jpg',
    'assests/images/BJ/qcc(53).jpg',
    'assests/images/BJ/qcc(54).jpg',
  ];

// 添加照片到照片墙
function addPhotoToWall(dataUrl, caption) {
    const photoWall = document.getElementById('photo-wall');
    const photoElement = document.createElement('div');
    photoElement.className = 'rounded-lg overflow-hidden group aspect-square relative animate-fadeIn';
    
    photoElement.innerHTML = `
        <img data-src="${dataUrl}" alt="${caption}" class="lazy-image w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110">
        <div class="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div class="p-4">
                <p class="text-white font-medium">${caption}</p>
            </div>
        </div>
    `;
    
    // 将新照片添加到照片墙的开头
    if (photoWall.firstChild) {
        photoWall.insertBefore(photoElement, photoWall.firstChild);
    } else {
        photoWall.appendChild(photoElement);
    }
    
    // 初始化延迟加载
    initLazyLoading();
}

// 初始化延迟加载
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.dataset.src;
                    image.classList.remove('lazy-image');
                    imageObserver.unobserve(image);
                }
            });
        });
        
        lazyImages.forEach(image => {
            imageObserver.observe(image);
        });
    } else {
        // 回退方案 - 一次性加载所有图片
        lazyImages.forEach(image => {
            image.src = image.dataset.src;
            image.classList.remove('lazy-image');
        });
    }
}

// 初始化页面
window.addEventListener('DOMContentLoaded', function() {
    // 从后端获取照片路径并添加到照片墙
    photoPaths.forEach((path, index) => {
        addPhotoToWall(path, `纪念册共 ${index + 1}张`);
    });
});