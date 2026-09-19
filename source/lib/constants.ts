export const CORRUPTION_CHARS = "¡¢Á¤Ã¦§¨©ª";

export const SECLEVEL_COLOR = ["T", "D", "F", "J", "L"];

export const SECLEVEL_TEXT = [
  "`TNULLSEC`",
  "`DLOWSEC`",
  "`FMIDSEC`",
  "`HHIGHSEC`",
  "`LFULLSEC`",
];

export const SECLEVEL_TEXT_SHORT = [
  "`TNS`",
  "`DLS`",
  "`FMS`",
  "`HHS`",
  "`LFS`",
];

export const regexNpcLoc =
  /(?:unknown|uknown|abndnd|abandoned|unidentified|derelict|anon|anonymous)_(?:\w{2}(?:wvr|stg|ttl|rvn|wlf)|jr)_[a-z0-9]{6}\.(?:info|out|external|public|pub|pub_info|pubinfo|p|access|entry|extern)_[a-z0-9]{6}/g
export const regexNpcUsername =
  /(?:unknown|uknown|abndnd|abandoned|unidentified|derelict|anon|anonymous)_(?:\w{2}(?:wvr|stg|ttl|rvn|wlf)|jr)_[a-z0-9]{6}/g
export const regexLocScriptname =
  /(?:info|out|external|public|pub|pub_info|pubinfo|p|access|entry|extern)_[a-z0-9]{6}/g

export const regexColor = /`([a-zA-Z0-9])([^`]*)`/g;

export const TEMP_CHARS = {
  '\\"': "\uFFFF",
  " ": "\uFFFE",
  "\\ ": "\uFFFE",
  "-": "\uFFFD",
  "\\\\": "\uFFFC",
  "\uFFFA": "\uFFFA",
  "\\[": "\uFFF9",
  "[": "\uFFF9",
  "\\]": "\uFFF8",
  "]": "\uFFF8",
};

export const REVERSE_TEMP_CHARS = {
  "\uFFFF": '"',
  "\uFFFE": " ",
  "\uFFFD": "-",
  "\uFFFC": "\\",
  "\uFFFA": "\uFFFA",
  "\uFFF9": "[",
  "\uFFF8": "]",
};

import {
  source_calling_scriptor,
  source_top_calling_script,
} from "./calling_stuff";

export const calling_scriptor = source_calling_scriptor;

export const top_calling_script = source_top_calling_script;

// Old https.public output, back when I typed it manually.
// I use it as a backup for if I need to nuke it.
export const oldPublic = (
  `
    \`UWelcome to https.public!\`
    
    
                \`1SCRIPTS\`
    
      ${scriptNameDisplay("https.cli")} - \`UA tool to add CLI-like simple input support to scripts.\`
    
      ${scriptNameDisplay("https.inspect")} - \`UA script and user inspector. Very good tool to have.\`
          * \`JHIGHSEC\` \`Udue to use of users.inspect.\`
      
      ${scriptNameDisplay("https.neofetch")} - \`UNeofetch, but hackmud! Actually useful.\`
          * \`FMIDSEC\` \`Udue to use of scripts.user.\`
    
      ${scriptNameDisplay("https.marks_sync")} - \`UA way to sync your marks between users.\`
    
      ${scriptNameDisplay("https.glam_case")} - \`UA public display case for all my glams.\`
    
      ${scriptNameDisplay("https.echo")} - \`UAn equivalent to the real-world\` \`Becho\` \`Ucommand.\`
      
      ${scriptNameDisplay("https.market")} - \`UA market.browse wrapper that incorperates my upgrade display. In beta, please give feedback.\`
      
      ${scriptNameDisplay("https.wheres_walter")} - \`UA series of questions which will eventually lead to\` \`nwalter\`. \`Uhm_jam_v2 submission.\`
    
      ${scriptNameDisplay("https.spam")} - \`UA script to rapidly run a given script.\`
      
      ${scriptNameDisplay("https.binmat_recon")} - \`UA BINMAT script that shows what the GUI doesn't.\`
    
      ${scriptNameDisplay("https.marks")} - \`UA script that lists all of your completed marks.\`
          * \`JHIGHSEC\` \`Udue to use of marks.protocol.\`
          * \`WSubscript documentation avaliable by passing docs:true into the script.\`
    
      ${scriptNameDisplay("https.upgrades")} - \`UMy upgrade viewer. Continual development. Feedback appreciated.\`
    
      ${scriptNameDisplay("https.transactions")} - \`UTransaction history viewer. Nicer version of accts.transactions.\`
    
      ${scriptNameDisplay("https.upg_sort")} - \`UA script to sort your upgrades.\`
          * \`FMIDSEC\` \`Udue to use of sys.manage.\`
          * \`WAliases: https.u_sort\`
    
      ${scriptNameDisplay("https.k3y_manage")} - \`UA way to manage your k3ys based on the k3y's value.\`
          * \`FMIDSEC\` \`Udue to use of sys.manage.\`
    `
)

