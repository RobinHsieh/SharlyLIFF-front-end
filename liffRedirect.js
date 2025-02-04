(function() {
    // 允許被重定向的頁面路徑，請以檔案名稱呈現，不要前置斜線！
    const validPaths = ['courseDashboard.html', 'studentOverview.html'];
  
    /**
     * 檢查 URL 中是否有 liff.state 參數，
     * 若有則解碼、移除開頭的斜線並轉換成完整的 URL，
     * 如果符合條件則進行重導。
     */
    function handleLiffRedirect() {
      const urlParams = new URLSearchParams(window.location.search);
      const liffState = urlParams.get('liff.state');
      if (liffState) {
        // 移除開頭的斜線，變成相對路徑
        const relativePath = decodeURIComponent(liffState).replace(/^\//, "");
        console.log("Detected liff.state:", relativePath);
  
        if (validPaths.includes(relativePath)) {
          // 依據目前網址生成完整的導向 URL
          const redirectUrl = new URL(relativePath, window.location.href).href;
          console.log("Redirecting to:", redirectUrl);
          window.location.replace(redirectUrl);
        } else {
          console.error("Invalid liff.state path:", relativePath);
        }
      }
    }
  
    // 將此函式掛在全域
    window.handleLiffRedirect = handleLiffRedirect;
  })();
  