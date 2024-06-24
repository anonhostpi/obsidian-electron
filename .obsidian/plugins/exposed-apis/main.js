const obsidian = require("obsidian")
const electron = require("electron").remote
const Module = require("module")

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

const internals = {}
/*
class APISettingsTab extends obsidian.PluginSettingTab {
    
}
*/

class APIPlugin extends obsidian.Plugin {
    async onload(){
        // await this.loadSettings()
        // this.addSettingTab(new APISettingsTab(this.app, this))
        // const { settings } = this
        internals.plugin = this
        /*
        this.addCommand({
            id: "command-id",
            name: "command name"
            callback: cb
        })
        */
    }
    // onunload(){}
    // async loadSettings(){}
    // async saveSettings(){}

    require = require
    obsidian = obsidian
    electron = electron

    getSearchPaths( dir ){
        const paths = Module._nodeModulePaths("{0}")
        if( dir == null || dir.trim() === '' )
            return paths
        return paths.map( path => path.format( dir ) )
    }
}

module.exports = APIPlugin