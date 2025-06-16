const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const readline = require("readline");

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  fgRed: "\x1b[31m",
  fgGreen: "\x1b[32m",
  fgYellow: "\x1b[33m",
  fgBlue: "\x1b[34m",
  fgMagenta: "\x1b[35m",
  fgCyan: "\x1b[36m",
  fgWhite: "\x1b[37m",
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function walk(dir, callback) {
  fs.readdirSync(dir).forEach((file) => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) walk(full, callback);
    else callback(full);
  });
}

function isIgnored(file, inputPath, ignoreList) {
  const rel = path.relative(inputPath, file).replace(/\\/g, "/");
  return ignoreList.some(
    (ignore) => rel === ignore || rel.startsWith(ignore + "/")
  );
}

function logInfo(msg) {
  console.log(`${colors.fgCyan}[Encrypt]${colors.reset} ${msg}`);
}

function logSuccess(msg) {
  console.log(`${colors.fgGreen}[Encrypt]${colors.reset} ${msg}`);
}

function logWarning(msg) {
  console.warn(`${colors.fgYellow}[Encrypt]${colors.reset} ${msg}`);
}

function logError(msg) {
  console.error(`${colors.fgRed}[Encrypt]${colors.reset} ${msg}`);
}

function obfuscate(file, inputPath, outputPath, ignoreList) {
  if (isIgnored(file, inputPath, ignoreList)) {
    logInfo(`Skipped: ${path.relative(inputPath, file)}`);
    return;
  }

  const rel = path.relative(inputPath, file);
  const out = path.join(outputPath, rel);
  ensureDir(out);

  const ext = path.extname(file).toLowerCase();

  try {
    if (ext === ".js") {
      execSync(
        `npx javascript-obfuscator "${file}" --output "${out}" --compact true --self-defending true`
      );
      logSuccess(`JS obfuscated: ${rel}`);
    } else if (ext === ".css") {
      execSync(`npx cleancss -o "${out}" "${file}"`);
      logSuccess(`CSS minified: ${rel}`);
    } else if (ext === ".html") {
      execSync(
        `npx html-minifier-terser "${file}" -o "${out}" --collapse-whitespace --remove-comments`
      );
      logSuccess(`HTML minified: ${rel}`);
    } else {
      if (rel !== "ignore_encrypt.json") {
        fs.copyFileSync(file, out);
        logInfo(`Copied: ${rel}`);
      } else {
        logInfo(`Skipped Copied: ${rel}`);
      }
    }
  } catch (err) {
    logError(`Failed: ${rel} => ${err.message}`);
  }
}

async function main() {
  const inputPath = await ask("Enter input folder path: ");

  if (!inputPath.trim()) {
    logInfo("No input path provided. Exiting.");
    rl.close();
    process.exit(0);
  }

  const defaultOutput = inputPath.endsWith(path.sep)
    ? inputPath.slice(0, -1) + "_encrypt"
    : inputPath + "_encrypt";

  const outputPathInput = await ask(
    `Enter output folder path (default: ${defaultOutput}): `
  );
  const outputPath = outputPathInput.trim() || defaultOutput;

  rl.close();

  if (!fs.existsSync(inputPath)) {
    logError("Input folder does not exist!");
    process.exit(1);
  }

  let ignoreList = [];
  const ignoreFile = path.join(inputPath, "ignore_encrypt.json");
  if (fs.existsSync(ignoreFile)) {
    try {
      const raw = fs.readFileSync(ignoreFile, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        ignoreList = parsed.map((p) => p.replace(/\\/g, "/"));
        logInfo(`Loaded ignore list (${ignoreList.length}) from ${ignoreFile}`);
      } else {
        logWarning("ignore_encrypt.json must be an array.");
      }
    } catch (err) {
      logWarning(`Failed to parse ignore_encrypt.json: ${err.message}`);
    }
  }

  if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, { recursive: true });

  logInfo("Starting encryption...");
  logInfo(`Input:  ${inputPath}`);
  logInfo(`Output: ${outputPath}`);

  walk(inputPath, (file) =>
    obfuscate(file, inputPath, outputPath, ignoreList)
  );

  logSuccess("Encryption done.");
}

main();
