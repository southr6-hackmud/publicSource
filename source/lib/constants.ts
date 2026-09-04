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
  /(?:unknown|uknown|abndnd|abandoned|unidentified|derelict|anon|anonymous)_(?:\w{2}(?:wvr|stg|ttl|rvn|wlf)|jr)_[a-z0-9]{6}\.(?:info|out|external|public|pub|pub_info|pubinfo|p|access|entry|extern)_[a-z0-9]{6}/g;
export const regexNpcUsername =
  /(?:unknown|uknown|abndnd|abandoned|unidentified|derelict|anon|anonymous)_(?:\w{2}(?:wvr|stg|ttl|rvn|wlf)|jr)_[a-z0-9]{6}/g;
export const regexLocScriptname =
  /(?:info|out|external|public|pub|pub_info|pubinfo|p|access|entry|extern)_[a-z0-9]{6}/g;

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

