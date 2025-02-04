// liffRedirect.js
(function() {
    // 定義允許被重定向的頁面路徑（請根據你的實際頁面調整）
    const validPaths = ['/courseDashboard.html', '/studentOverview.html'];
  
    function handleLiffRedirect() {
        const urlParams = new URLSearchParams(window.location.search);
        let liffState = urlParams.get('liff.state');
        if (liffState) {
          // 去除前置斜線，變成相對路徑
          if (liffState.startsWith('/')) {
            liffState = liffState.substring(1);
          }
          console.log("Detected liff.state:", liffState);
          if (validPaths.includes('/' + liffState)) {  // 或調整 validPaths 的定義
            window.location.replace(liffState);
          } else {
            console.error("Invalid liff.state path:", liffState);
          }
        }
      }      
  
    // 將此函式暴露到全域，讓其他頁面可以調用
    window.handleLiffRedirect = handleLiffRedirect;
  })();
  