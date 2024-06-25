const path = require("path")
const {
    execSync
} = require("child_process")

function StringFormat(tmpl, ...args) {
    var args = arguments;
    args.shift();
    return tmpl.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined' ?
            args[number] :
            match;
    });
};

function StringIsNullOrWhitespace(str) {
    return str == null || str.toString().trim() === ''
}

console.log( __dirname)
const {
    author: GH_OWNER,
    repo: GH_REPO
} = require("manifest.json")
const NODE_PATH = process.env.NODE_PATH
if (StringIsNullOrWhitespace(NODE_PATH)) {
    NODE_PATH = execSync("npm root -g", {
        encoding: 'utf-8'
    }).toString().trim()
}
const OBSIDIAN_PATH = path.join(app.vault.adapter.basePath, app.vault.configDir)

globalThis.module.paths.push(NODE_PATH, path.join(OBSIDIAN_PATH, "node_modules"));

function install(package, global) {
    package = install.parse(package)

    const cmd = `npm install ${package} ${global ? "-g" : "--prefix ."}`
    const result = execSync(cmd, {
        encoding: 'utf-8',
        cwd: OBSIDIAN_PATH
    }).toString()

    return {
        package,
        result
    }
}

install.parse = (package) => {
    const {
        owner,
        repo,
        branch
    } = package
    if (StringIsNullOrWhitespace(owner) || StringIsNullOrWhitespace(repo)) {
        if (StringIsNullOrWhitespace(package))
            throw new Error("package name is required")
    } else {
        package = `github:${owner}/${repo}`
        if (!StringIsNullOrWhitespace(branch))
            package += `#${branch}`
    }

    return package
}

module.exports = (() => {
    const package = install.parse({
        owner: GH_OWNER,
        repo: GH_REPO
    })

    try {
        require.resolve(package)
    } catch {
        install(package)
    }

    const out = require(package)
    out.npm = {
        parse: install.parse,
        install
    }

    return out
})()