let items = [];  // 存放課程資料

async function fetchItems() {
    try {
        const response = await fetch("https://ozt1li4e01.execute-api.ap-northeast-3.amazonaws.com/prod/");
        const data = await response.json();
        console.log("取得資料成功");
        return data;
    } catch (err) {
        console.error("取得資料錯誤", err);
        return [];
    }
}

function sortData(data) {
    return data.sort((a, b) => {
        const dayA = parseInt(a.WEEK_DAY, 10);
        const dayB = parseInt(b.WEEK_DAY, 10);
        if (dayA !== dayB) {
            return dayA - dayB;
        } else {
            const numA = parseInt(a.BATCH.replace('L', ''), 10);
            const numB = parseInt(b.BATCH.replace('L', ''), 10);
            return numA - numB;
        }
    });
}