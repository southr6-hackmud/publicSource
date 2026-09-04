import { TEMP_CHARS, REVERSE_TEMP_CHARS } from "../lib/constants"

export default function (context: Context, args: { input?: string, is_script?: boolean, docs?: boolean | string }) {
    let lib = $fs.scripts.lib()

    let aliases: Aliases = {}

    let options: ParseOptions = {
        parse_string_bool: true,
        parse_string_num: false,
        parse_nested_input: false,
        boolean_flags: false
    }

    function cli_parse(input: string): ParseOut {
        if (typeof input != "string") {
            throw { stack: "https.cli: CLI input parser was not given a string." }
        }

        // let cliArgRegex = /(?:--|-)([^= ]*)(?:(?: |=)([^- ]*))?/g
        // let cliArgRegex = /(?:--|-)([^= ]*)(?:(?: |=)([^ ]*))?/g
        // let cliArgRegex = /(?:--|-)([^= ]*)(?:(?: |=)([^-][^ ]*))?/g
        let cliArgRegex = /(?:--|-)([^= ]*)(?:(?: |=)(-[0-9]+|[^-][^ ]*))?/g

        let out: ParseOut = {
            input: input,
            remainder: undefined,
            parsedArgs: {}
        }

        let jankIn = input

        jankIn = jankIn.replaceAll("\\\"", TEMP_CHARS["\\\""])
        jankIn = jankIn.replaceAll("\\ ", TEMP_CHARS["\\ "])
        jankIn = jankIn.replaceAll("\\[", TEMP_CHARS["\\["])
        jankIn = jankIn.replaceAll("\\]", TEMP_CHARS["\\]"])

        let strings = [...jankIn.matchAll(/"([^"]*)"/g)]

        for (var string of strings) {
            let temp = string[1]
            for (const char in TEMP_CHARS) {
                temp = temp.replaceAll(char, TEMP_CHARS[char])
            }
            jankIn = jankIn.replaceAll(string[0], temp)
        }

        let nest_regex = /\[([^\]]*)\]/g
        // let nest_regex = /\[([^\[\]]*)\]/g
        // let nest_regex = /\[(.*)\]/g

        let nested_inputs = []

        // while (options.parse_nested_input && nest_regex.test(jankIn)) {
        if (options.parse_nested_input) {
            let nests = [...jankIn.matchAll(nest_regex)]
            // $D(nests)

            for (const nest of nests) {
                // $D(nested)
                nested_inputs.push(nest[1])
                jankIn = jankIn.replaceAll(nest[0], "\uFFFA")
            }

            // $D(nested_inputs)
            // $D(jankIn)
        }

        type CLIRegexMatch = [match: string, opt: string, value: string]

        let matches: CLIRegexMatch[] = (([...jankIn.matchAll(cliArgRegex)] as unknown) as CLIRegexMatch[])

        // $D(matches)

        for (var match of matches) {
            // $D(match)

            if (match[2] == null) {
                match[2] = ""
            }

            // if (["input", "remainder"].includes(match[1])) {
            //     throw new EvalError("Keys \"input\" and \"remainder\" are reserved, and cannot be used.")
            // }

            // $D(match)

            if (match[0].slice(0, 2) == "--") {
                for (const key in aliases) {
                    if (aliases[key].includes(match[1])) {
                        match[1] = key
                    }
                }
                if (out.parsedArgs[match[1]] !== undefined) {
                    if (!Array.isArray(out.parsedArgs[match[1]])) {
                        out.parsedArgs[match[1]] = [out.parsedArgs[match[1]], (match[2] ? match[2] : true)]
                    }
                    else {
                        out.parsedArgs[match[1]].push(match[2] ? match[2] : true)
                    }
                }
                else {
                    out.parsedArgs[match[1]] = (match[2] ? match[2] : true)
                }
                // $D(match)
            }
            else if (match[1].length > 1) {
                if (match[2].length > 0) {
                    let lastOpt = match[1].slice(-1)
                    for (const key in aliases) {
                        if (aliases[key].includes(lastOpt)) {
                            lastOpt = key
                        }
                    }
                    if (out.parsedArgs[lastOpt] !== undefined) {
                        if (!Array.isArray(out.parsedArgs[lastOpt])) {
                            out.parsedArgs[lastOpt] = [out.parsedArgs[lastOpt], match[2]]
                        }
                        else {
                            out.parsedArgs[lastOpt].push(match[2])
                        }
                    }
                    else {
                        out.parsedArgs[lastOpt] = match[2]
                    }
                    match[1] = match[1].slice(0, -1)
                }
                for (var opt of match[1]) {
                    for (const key in aliases) {
                        if (aliases[key].includes(opt)) {
                            opt = key
                        }
                    }
                    if (out.parsedArgs[opt] !== undefined) {
                        if (!Array.isArray(out.parsedArgs[opt])) {
                            out.parsedArgs[opt] = [out.parsedArgs[opt], true]
                        }
                        else {
                            out.parsedArgs[opt].push(true)
                        }
                    }
                    else {
                        out.parsedArgs[opt] = true
                    }
                }
                // $D(match)
            }
            else if (match[2].length == 0) {
                for (const key in aliases) {
                    if (aliases[key].includes(match[1])) {
                        match[1] = key
                    }
                }
                if (out.parsedArgs[match[1]] !== undefined) {
                    if (!Array.isArray(out.parsedArgs[match[1]])) {
                        out.parsedArgs[match[1]] = [out.parsedArgs[match[1]], true]
                    }
                    else {
                        out.parsedArgs[match[1]].push(true)
                    }
                }
                else {
                    out.parsedArgs[match[1]] = true
                }
                // $D(match)
            }
            else {
                for (const key in aliases) {
                    if (aliases[key].includes(match[1])) {
                        match[1] = key
                    }
                }
                if (out.parsedArgs[match[1]] !== undefined) {
                    if (!Array.isArray(out.parsedArgs[match[1]])) {
                        out.parsedArgs[match[1]] = [out.parsedArgs[match[1]], match[2]]
                    }
                    else {
                        out.parsedArgs[match[1]].push(match[2])
                    }
                }
                else {
                    out.parsedArgs[match[1]] = match[2]
                }
                // $D(match)
            }
        }

        out.remainder = jankIn.replaceAll(cliArgRegex, "").split(" ").filter((v) => v != "").join(" ")

        for (const char in REVERSE_TEMP_CHARS) {
            for (const arg in out.parsedArgs) {
                if (typeof out.parsedArgs[arg] == "string") {
                    out.parsedArgs[arg] = out.parsedArgs[arg].replaceAll(char, REVERSE_TEMP_CHARS[char])
                }
                else if (Array.isArray(out.parsedArgs[arg])) {
                    out.parsedArgs[arg] = (out.parsedArgs[arg] as any[]).map((v) => typeof v == "string" ? v.replaceAll(char, REVERSE_TEMP_CHARS[char]) : v)
                }
            }
        }

        if (options.boolean_flags) {
            for (const arg in out.parsedArgs) {
                if (options.boolean_flags.includes(arg) && typeof out.parsedArgs[arg] == "string") {
                    out.remainder += (out.remainder == "" ? out.parsedArgs[arg] : ` ${out.parsedArgs[arg]}`)
                    out.parsedArgs[arg] = true
                }
            }
        }

        if (options.parse_string_bool) {
            for (const arg in out.parsedArgs) {
                if ((Array.isArray(options.parse_string_bool) && options.parse_string_bool.includes(arg)) || options.parse_string_bool === true) {
                    if (typeof out.parsedArgs[arg] == "string") {
                        let pArg = out.parsedArgs[arg]
                        if (pArg === "false") {
                            out.parsedArgs[arg] = false
                        }
                        else if (pArg === "true") {
                            out.parsedArgs[arg] = true
                        }
                    }
                    else if (Array.isArray(out.parsedArgs[arg])) {
                        out.parsedArgs[arg] = (out.parsedArgs[arg] as any[]).map((v) => typeof v == "string" ? (v === "false" ? false : (v === "true" ? true : v)) : v)
                    }
                }
            }
        }

        if (options.parse_string_num) {
            for (const arg in out.parsedArgs) {
                if ((Array.isArray(options.parse_string_num) && options.parse_string_num.includes(arg)) || options.parse_string_num === true) {
                    if (typeof out.parsedArgs[arg] == "string") {
                        let pArg = out.parsedArgs[arg]
                        out.parsedArgs[arg] = isNaN(pArg) ? pArg : Number(pArg)
                    }
                    else if (Array.isArray(out.parsedArgs[arg])) {
                        out.parsedArgs[arg] = (out.parsedArgs[arg] as any[]).map((v) => typeof v == "string" ? (isNaN(v) ? v : Number(v)) : v)
                    }
                }
            }
        }

        if (options.parse_nested_input) {
            for (const arg in out.parsedArgs) {
                if (typeof out.parsedArgs[arg] == "string") {
                    if (out.parsedArgs[arg] == "\uFFFA") {
                        out.parsedArgs[arg] = cli_parse(nested_inputs.splice(0, 1)[0]).parsedArgs
                    }
                }
                else if (Array.isArray(out.parsedArgs[arg])) {
                    out.parsedArgs[arg] = (out.parsedArgs[arg] as any[]).map((v) => v == "\uFFFA" ? cli_parse(nested_inputs.splice(0, 1)[0]).parsedArgs : v)
                }
            }
        }

        // if (context.calling_script && context.calling_script == "https.scratch") {
        //     out.options = JSON.parse(JSON.stringify(options))
        // }

        // $D(out)
        return out
    }

    cli_parse.set_aliases = (input: Aliases) => {
        aliases = input
    }

    cli_parse.add_alias = (key: string, alias: string[]) => {
        if (!aliases[key]) {
            aliases[key] = alias
        }
        else {
            aliases[key].push(...alias)
        }
    }

    cli_parse.aliases = () => aliases

    cli_parse.set_options = (input: ParseOptions) => {
        for (const option in input) {
            options[option] = input[option]
        }
    }

    cli_parse.options = () => options

    if (lib.is_script(context, args)) {
        return cli_parse
    }

    // return cli_parse(args.input)

    // cli_parse.set_aliases(
    //     { docs: ["help", "h"] }
    // )

    // let cli_args: { docs?: boolean | string } | undefined

    let origArgs = args

    if (args && args.input) {
        args = cli_parse(args.input).parsedArgs
    }

    if (!args) {
        return (
            `

            \`Y--\` \`Uhttps\`.\`Lcli\` \`Y--\`


\`AUSAGE\`

https.cli

https.cli \`A--docs\`


\`WDESCRIPTION\`

\`UThis is a tool that takes CLI-like options and flags given via simple input, and turns them into an object.\`

\`USee subscript documentation by passing\` \`A--docs\`\`U.\`

\`UPreview what this looks like by passing some CLI-like input now!\`
`
        )
    }
    else if (args && args.docs) {
        if (args.docs == "type") {
            return (
                `

\`Ytype\` \`OParseOptions\` \`Y=\` \`L{\`
    \`V[\`\`Foption\`: \`Ostring\`\`V]\`: \`Oboolean\` \`Y|\` \`Ostring\`\`V[]\` \`Y|\` \`Oundefined\`,
    \`Nparse_string_bool\`\`Y?\`: \`Oboolean\` \`Y|\` \`Ostring\`\`V[]\`,
    \`Nparse_string_num\`\`Y?\`: \`Oboolean\` \`Y|\` \`Ostring\`\`V[]\`,
    \`Nparse_nested_input\`\`Y?\`: \`Oboolean\`
\`L}\`


\`Yinterface\` \`OPlayerFullsec\` \`L{\`
    \`Ahttps\`: \`V{\`
        \`Mcli\`: \`D()\` \`Y=>\` \`D{\`
            \`P(\`\`Finput\`: \`Ostring\`\`P)\`: \`P{\`
                \`Ninput\`: \`Ostring\`,
                \`Nremainder\`: \`Ostring\`,
                \`NparsedArgs\`: \`T{\` \`A[\`\`Farg\`: \`Ostring\`\`A]\`: \`Oboolean\` \`Y|\` \`Ostring\` \`Y|\` \`Ostring\`\`A[]\` \`T}\`
            \`P}\`,
            \`Maliases\`: \`P()\` \`Y=>\` \`P{\` \`T[\`\`Fkey\`: \`Ostring\`\`T]\`: \`Ostring\`\`T[]\` \`P}\`,
            \`Mset_aliases\`: \`P(\`\`Faliases\`: \`T{\` \`A[\`\`Fkey\`: \`Ostring\`\`A]\`: \`Ostring\`\`A[]\` \`T}\`\`P)\` \`Y=>\` \`Ovoid\`,
            \`Moptions\`: \`P()\` \`Y=>\` \`OParseOptions\`,
            \`Mset_aliases\`: \`P(\`\`Foptions\`: \`OParseOptions\`\`P)\` \`Y=>\` \`Ovoid\`,
        \`D}\`
    \`V}\`
\`L}\`

`
            )
        }
        else if (args.docs == "options") {
            return (
                `

\`Icli_parse\` \`Uhas some options that change how aruments are parsed.\`

\`UThese options stem from the fact that when a value is given to a flag (\`\`A--foo bar\`\`U), it is a string.\`

\`UIf you wish to test these options, pass the option as a flag into https.cli with your testing values.\`

\`UExample:\` \`Ahttps.cli --parse_nested_input --parse_string_num --foo [ --bar 2 ]\`


\`XOPTIONS\`


- \`Nparse_string_bool\`
  * \`UIf\` \`V"true"\` \`Uand\` \`V"false"\` \`Uare to be transformed into their namesake booleans.\`
  * \`UA\` \`Oboolean\` \`Usetting determines if this is done for all parsed arguments.\`
  * \`UA\` \`Ostring\`\`L[]\` \`Usetting makes this done for only the listed keys.\`
  * \`UHas a default setting of\` \`Vtrue\`\`U.\`

- \`Nparse_string_num\`
  * \`UIf "numbers" are to be transformed into actual numbers.\`
  * \`UA\` \`Oboolean\` \`Usetting determines if this is done for all parsed arguments.\`
  * \`UA\` \`Ostring\`\`L[]\` \`Usetting makes this done for only the listed keys.\`
  * \`UHas a default setting of\` \`Vfalse\`\`U.\`

- \`Nparse_nested_input\`
  * \`UIf\` \`Ynested parsing\` \`Uis to be enabled.\`
  * \`UA\` \`Oboolean\` \`Usetting determines if this is done for all parsed arguments.\`
  * \`UHas a default setting of\` \`Vfalse\`\`U.\`


\`YNESTED PARSING\`


\`UNested parsing is a way to have an object as the value of a parsed argument.\`

\`UIt uses the following syntax:\`

    \`A--foo [\` \`C<cli arguments>\` \`A]\`

\`UThe content of the brackets is passed into\` \`Icli_parse\`\`U, and the resulting\` \`NparsedArgs\` \`Uis set as the value.\`

\`UAt this time, you cannot have nested input in nested input. It is unknown behaviour.\`
`
            )
        }
        else {
            return (
                `

\`UTo use this in your scripts, place a line like this near the start:\`

\`Ylet\` \`Icli_parse\` \`Y=\` \`T#fs\`.\`Chttps\`.\`Lcli\`\`V()\`

\`UWhen called as a subscript, https.cli returns a function that has additional methods, similar to perf.track.\`

\`UPass\` \`A--docs type\` \`UFor\` \`PTypeScript\` \`Utype definitions. Ideal for if you use HSM/HSE.\`

\`UPass\` \`A--docs options\` \`UFor information on settable parsing options.\`


\`XFUNCTIONS\`


\`Icli_parse\`\`L(\` \`Finput\`: \`Ostring\` \`L)\` - \`UThis is the actual parser.\`

\`UYou give it a string (typically\` \`Fargs\`.\`Ainput\`\`U), and it will return the following object: \`

\`L{\`
    \`Ninput\`: \`Ostring\`, \`C\/\/ The original input given to the parser.\`
    \`Nremainder\`: \`Ostring\`, \`C\/\/ Any unparsed terms.\`
    \`NparsedArgs\`: \`V{\`
        \`D[\`\`Farg\`: \`Ostring\`\`D]\`: \`Oboolean\` \`Y|\` \`Ostring\` \`Y|\` \`Ostring\`\`P[]\` \`C\/\/ The parsed arguments object.\`
    \`V}\`
\`L}\`


\`Icli_parse\`.\`Mset_aliases\`\`L(\` \`Faliases\`: \`V{\` \`D[\`\`Fkey\`: \`Ostring\`\`D]\`: \`Ostring\`\`P[]\` \`V}\` \`L)\` - \`USet aliases for keys before parsing.\`

\`UAny names that are in the list will be translated to the key of that list.\`

\`UFor example, if I set the following aliases:\`

\`L{\`
    \`Ehelp\`: \`V[\` \`K"h"\`, \`K"docs"\` \`V]\`
\`L}\`

\`UThe flags\` \`A--help\`\`U,\` \`A-h\`\`U, and\` \`A--docs\` \`Uwould all be assigned to the\` \`Ehelp\` \`Ukey inside\` \`NparsedArgs\`\`U.\`


\`Icli_parse\`.\`Maliases\`\`L()\` - \`UReturns the currently set aliases, or an empty object if none are set.\`


\`Icli_parse\`.\`Mset_options\`\`L(\` \`Foptions\`: \`OParseOptions\` \`L)\` - \`USet options for parsing.\`


\`Icli_parse\`.\`Moptions\`\`L()\` - \`UReturns the currently set parsing options.\`
`
            )
        }
    }
    else {
        for (const opt in options) {
            options[opt] = args[opt] != undefined ? args[opt] : options[opt]
        }
        return cli_parse(origArgs.input)
    }
}