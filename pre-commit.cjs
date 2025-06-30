const { execSync } = require("child_process");

console.log("Running pre-commit hook...");

try {
	// 1. 获取最新动画数据
	console.log("Fetching latest bangumi data...");
	execSync("node fetch-bangumi.cjs", { stdio: "inherit" });

	// 2. 添加更新后的数据文件
	execSync("git add ./bangumi/bangumi.json", { stdio: "inherit" });

	console.log("✅ Pre-commit hook completed successfully");
} catch (error) {
	console.error("❌ Pre-commit hook failed:", error.message);
	process.exit(1);
}
