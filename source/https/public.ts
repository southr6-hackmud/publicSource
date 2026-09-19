import { ssoAuth } from "../lib/auth"
import { oldPublic } from "../lib/constants"

type DBHttpsPublic = {
    _id?: "public_script_list",
    order: string[]
} & {
    [script: string]: {
        name: string,
        desc?: string,
        notes?: string[]
    }
}

export default function (
    context: Context,
    args: {
        input?: string,
        reset?: boolean,
        new?: string,
        desc?: string,
        notes?: string | string[],
        pos?: number,
        remove?: string,
        confirm?: boolean
    }) {

    let cli_parse = $fs.https.cli()

    cli_parse.set_aliases(
        {
            new: ["name", "add", "a", "script", "s"],
            desc: ["d"],
            notes: ["n"],
            pos: ["p"],
            confirm: ["c"],
            remove: ["r"],
        }
    )

    cli_parse.set_options(
        {
            parse_string_bool: false,
            parse_string_num: true
        }
    )

    if (args && args.input) {
        args = cli_parse(args.input).parsedArgs
    }

    function scriptNameDisplay(script: string) {
        const SECLEVEL_REPS = [
            "`TNS`",
            "`DLS`",
            "`FMS`",
            "`JHS`",
            "`LFS`"
        ]
        let seclevel = $fs.scripts.get_level({ name: script })
        return `[${typeof seclevel == "number" ? SECLEVEL_REPS[seclevel] : "NA"}] ${script}`
    }


    function displayMap(script: DBHttpsPublic["script"]) {
        return `  ${scriptNameDisplay(script.name)}${script.desc ? ` - ${script.desc}` : ""}\n${script.notes && script.notes.length > 0 ? script.notes.map((note) => `      * ${note}\n`).join("") : ""}`
    }

    if (ssoAuth() && args && args.reset && args.confirm) {
        $db.r({ _id: "public_script_list" })
        let publicConvertRegex = /\[.{5}\] (?<name>(?<host>[a-z0-9_]*)\.(?<script>[a-z0-9_]*)) - (?<desc>[^\n]*)(?<notes>(?:(?:\n?.*)\* (?:[^\n]*))*)/g
        let getNotesRegex = /.*\* (?<note>.*)/g


        let matches = oldPublic.matchAll(publicConvertRegex)
        let temp: DBHttpsPublic = {}

        for (const match of matches) {
            let notes: string[] = []
            let info = match.groups as { name: string, host: string, script: string, desc: string, notes: string }
            for (const note of info.notes.matchAll(getNotesRegex)) {
                notes.push(note.groups.note)
            }
            temp[`${info.host}-${info.script}`] = {
                name: info.name,
                desc: info.desc,
                notes: notes
            }
            notes.length == 0 ? delete temp[`${info.host}-${info.script}`].notes : null
        }

        // return out

        temp.order = []

        for (const foo in temp) {
            foo != "order" ? temp.order.push(temp[foo].name) : null
        }


        $db.us({ _id: "public_script_list" }, { "$set": temp })
    }

    // if (args && args.remove && args.confirm) {
    if (ssoAuth() && args && args.remove && args.confirm) {
        $db.us({ _id: "public_script_list" }, { $unset: { [args.remove.replace(".", "-")]: true }, $pull: { order: args.remove } })
    }

    // if (args && args.new) {
    if (ssoAuth() && args && args.new) {
        // let order = $db.f({ _id: "public_script_list" }, { order: true }).first_and_close().order as string[]
        // args.pos ? order.splice(args.pos, 0, args.new) : !order.includes(args.new) ? order.push(args.new) : null
        let setop: { [key: string]: string | string[] } = {
            [`${args.new.replace(".", "-")}.name`]: args.new,
            // [`${args.new.split(".")[1]}.desc`]: args.desc,
            // [`${args.new.split(".")[1]}.notes`]: typeof args.notes == "string" ? Array(args.notes) : args.notes,
            // order: order
        }
        if (args.pos) {
            // let newOrder = order.filter((v) => v != args.new).sort((a, b) => order.indexOf(a) - order.indexOf(b))
            // newOrder.splice(args.pos, 0, args.new)
            // order = newOrder
            $db.us(
                { _id: "public_script_list" },
                {
                    $pull: { order: args.new },
                    // $push: {
                    //     order: {
                    //         $each: [args.new],
                    //         $position: args.pos
                    //     }
                    // }
                }
            )
            $db.us(
                { _id: "public_script_list" },
                {
                    $push: {
                        order: {
                            $each: [args.new],
                            $position: args.pos
                        }
                    }
                }
            )
        }
        else {
            $db.us(
                { _id: "public_script_list" },
                {
                    $addToSet: {
                        order: args.new
                    }
                }
            )
        }

        let newEntry = {
            name: args.new,
            desc: args.desc,
            notes: typeof args.notes == "string" ? Array(args.notes) : args.notes
        }


        args.desc ? setop[`${args.new.replace(".", "-")}.desc`] = args.desc : null
        args.notes && Array.isArray(args.notes) ? setop[`${args.new.replace(".", "-")}.notes`] = args.notes.filter(v => typeof v == "string") : null


        $db.us(
            { _id: "public_script_list" },
            {
                $set: setop
            }
        )

        if (typeof args.notes == "string") {
            $db.us(
                { _id: "public_script_list" },
                {
                    $push: { [`${args.new.replace(".", "-")}.notes`]: args.notes }
                }
            )
        }
    }

    let scriptListDB = $db.f({ _id: "public_script_list" }).first_and_close() as DBHttpsPublic
    let order = scriptListDB.order
    delete scriptListDB._id
    delete scriptListDB.order

    let scriptlist = Object.values(scriptListDB)

    let sortFunc = (a, b) => {
        return order.indexOf(a.name) - order.indexOf(b.name)
    }

    scriptlist.sort(sortFunc)

    return (
        `
\`UWelcome to https.public!\`


            \`1SCRIPTS\`

${scriptlist.map(displayMap).join("\n")}
`
    )

}
