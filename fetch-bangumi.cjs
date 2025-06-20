const axios = require("axios");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// 加载环境变量
dotenv.config();

// 配置参数
const BANGUMI_USER_NAME = process.env.BANGUMI_USER_NAME;
const OUTPUT_DIR = path.resolve(__dirname, "./bangumi");
const OUTPUT_FILE_ANIMATION_1 = path.join(OUTPUT_DIR, "bangumi_animation_1.json");

// 获取条目数据
async function fetchBangumis() {
    let allItems = [];
    const seenIds = new Set();
    const limit = 20;
    let hasDuplicate = false;

    try {
        let url = `https://api.bgm.tv/v0/users/${BANGUMI_USER_NAME}/collections?subject_type=2&type=2&limit=${limit}`;
        let i = 1;

        while (true) {
            url += `&offset=${i}`
            const headers = {
                Accept: "application/json",
                "User-Agent": "physnya/blog",
            };

            const response = await axios.get(url, { headers });
            const data = response.data.data;

            // 检查是否有重复
            for (const item of data) {
                if (seenIds.has(item.subject_id)) {
                    hasDuplicate = true;
                    break;
                }
                seenIds.add(item.subject_id);
            }

            if (hasDuplicate) {
                // 删除所有重复的项
                const uniqueItems = [];
                const idCount = {};
                for (const item of allItems) {
                    idCount[item.subject_id] = (idCount[item.subject_id] || 0) + 1;
                }
                for (const item of allItems) {
                    if (idCount[item.subject_id] === 1) {
                        uniqueItems.push(item);
                    }
                }
                allItems = uniqueItems;
                break;
            }

            const filtered = data.filter((item) => !item.private);
            allItems = [...allItems, ...filtered];

            i++;
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