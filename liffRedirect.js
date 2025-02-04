(function() {
    // 允許被重定向的頁面路徑（改成相對路徑，不要前置斜線）
    const validPaths = ['courseDashboard.html', 'studentOverview.html'];
  
    /**
     * 檢查 URL 中是否有 liff.state 參數，
     * 若有則解碼並驗證，如果符合條件則進行重定向。
     */
    function handleLiffRedirect() {
      const urlParams = new URLSearchParams(window.location.search);
      const liffState = urlParams.get('liff.state');
      if (liffState) {
        // 解碼後移除前面的斜線，確保路徑為相對路徑
        const targetPath = decodeURIComponent(liffState).replace(/^\//, "");
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
