// liffRedirect.js
(function() {
    // 定義允許被重定向的頁面路徑（請根據你的實際頁面調整）
    const validPaths = ['/courseDashboard.html', '/studentOverview.html'];
  
    /**
     * 檢查 URL 中是否有 liff.state 參數，
     * 若有則解碼並驗證，如果符合條件則進行重定向。
     */
    function handleLiffRedirect() {
      const urlParams = new URLSearchParams(window.location.search);
      const liffState = urlParams.get('liff.state');
      if (liffState) {
        const targetPath = decodeURIComponent(liffState);
        console.log("Detected liff.state:", targetPath);
        if (validPaths.includes(targetPath)) {
          // 若符合條件，就替換當前頁面為 targetPath
          window.location.replace(targetPath);
        } else {
          console.error("Invalid liff.state path:", targetPath);
        }
      }
    }
  
    // 將此函式暴露到全域，讓其他頁面可以調用
    window.handleLiffRedirect = handleLiffRedirect;
  })();
  