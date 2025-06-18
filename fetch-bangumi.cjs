const axios = require("axios");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// 加载环境变量
dotenv.config();

// 配置参数
const BANGUMI_USER_NAME = process.env.BANGUMI_USER_NAME;
const OUTPUT_DIR = path.resolve(__dirname, "../docs/.vuepress/public/bangumi");
const OUTPUT_FILE_ANIMATION_1 = path.join(OUTPUT_DIR, "bangumi_animation_1.json");

// 获取条目数据
async function fetchBangumis() {
    let allItems = [];
    let lastId = 0;
    const limit = 10;
    const maxPages = 5;

    try {
        for (let i = 1; i < maxPages + 1; i++) {
            let url = `https://api.bgm.tv/v0/users/${BANGUMI_USER_NAME}/collections?subject_type=2&type=2&limit=${limit}`;
            if (lastId) url += `&offset=${i}`;

            const headers = {
                Accept: "application/json",
                "User-Agent": "physnya/blog",
            };

            const response = await axios.get(url, { headers });
            const data = response.data;

            if (!data || data.length === 0) break;

            const filtered = data.filter((item) => !item.private);
            allItems = [...allItems, ...filtered];
        }

        return allItems;
    } catch (error) {
        console.error("Error fetching bangumis:", error.message);
        return [];
    }
}

// 主函数
(async () => {
    try {
        // 确保输出目录存在
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }

        // 获取并保存数据
        const items = await fetchBangumis();
        fs.writeFileSync(OUTPUT_FILE_ANIMATION_1, JSON.stringify(items, null, 2));
        console.log(`✅ Successfully saved ${items.length} bangumis to ${OUTPUT_FILE_ANIMATION_1}`);
    } catch (error) {
        console.error("❌ Failed to fetch bangumis:", error);
        process.exit(1);
    }
})();