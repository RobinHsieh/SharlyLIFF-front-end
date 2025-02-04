let items = [];  // 存放課程資料

async function initStudentOverview() {
    try {
        console.log("StudentOverview: LIFF 已初始化");
        document.getElementById("help-link").addEventListener("click", showStudentOverviewHelpView);
        document.getElementById("back-link").addEventListener("click", showIndexView);
    } catch (err) {
        console.error("請假狀況頁面初始化錯誤", err);
    }
    renderStudentOverviewList(items);
    syncStudentOverviewData();
}

async function syncStudentOverviewData() {
    const newData = await fetchItems();
    updateStudentOverviewList(newData);
}

function renderStudentOverviewList(data) {
    const sortedData = sortData(data);
    const listContainer = document.getElementById("schedule-list");

    sortedData.forEach(item => {
        if (!document.getElementById(`card-${item.PK}`)) {
            const card = document.createElement("div");
            card.classList.add("card");
            card.id = `card-${item.PK}`;

            card.innerHTML = `
        <div class="card-header">
          <span class="week-day">星期 ${item.WEEK_DAY}</span>
          <span class="batch">梯次 ${item.BATCH}</span>
        </div>
        <div class="card-body">
          <p>課號: <strong>${item.PK}</strong></p>
          <p>狀態: <span id="status-${item.PK}" class="${item.IS_OPEN ? 'open' : 'closed'}">
            ${item.IS_OPEN ? "開啟" : "關閉"}
          </span></p>
          <div class="button-group">
            <button class="leave-btn" onclick="sendLiffMessage('請假顯示 ${item.PK}')">
              請假顯示
            </button>
            <button class="late-btn" onclick="sendLiffMessage('晚到顯示 ${item.PK}')">
              晚到顯示
            </button>
            <button class="recital-btn" onclick="sendLiffMessage('背書顯示 ${item.PK}')">
              背書顯示
            </button>
          </div>
        </div>
      `;

            listContainer.appendChild(card);
        }
    });
}

function updateStudentOverviewList(newData) {
    const newItemsMap = new Map(newData.map(item => [item.PK, item]));

    newItemsMap.forEach((newItem, pk) => {
        const oldItem = items.find(i => i.PK === pk);
        if (!oldItem) {
            renderStudentOverviewList([newItem]);
        } else if (oldItem.IS_OPEN !== newItem.IS_OPEN) {
            document.getElementById(`status-${pk}`).textContent = newItem.IS_OPEN ? "開啟" : "關閉";
            document.getElementById(`status-${pk}`).className = newItem.IS_OPEN ? "open" : "closed";
        }
    });

    items = newData;
    reorderStudentOverviewDomElements();
}

function reorderStudentOverviewDomElements() {
    const sortedData = sortData(items);
    const listContainer = document.getElementById("schedule-list");
    sortedData.forEach(item => {
        const card = document.getElementById(`card-${item.PK}`);
        if (card) {
            listContainer.appendChild(card);
        }
    });
}

function showStudentOverviewHelpView() {
    document.getElementById("studentOverview-view").style.display = "none";
    document.getElementById("help-view").style.display = "block";
}

function showIndexView() {
    document.getElementById("help-view").style.display = "none";
    document.getElementById("studentOverview-view").style.display = "block";
}

// window.addEventListener("load", initStudentOverview);