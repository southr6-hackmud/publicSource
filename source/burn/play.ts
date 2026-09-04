export default function (context: Context, args: { loc: Scriptor<{}>, burn_ante?: boolean, x: { name: "accts.xfer_gc_to", call: typeof $ms.accts.xfer_gc_to } }) {
    var caller = context.caller
    var lib = $fs.scripts.lib()

    const ante = 8000000

    if (context.calling_script && context.calling_script != "https.play") {
        return { ok: false, msg: "`U403`" }
    }

    if ($fs.southr6.give_binmat_ante({ balance: true }) < ante * 4) {
        return { ok: false, msg: "\n`UInsufficient funds to give BINMAT ante. Sorry for the inconvenience.`" }
    }

    if (args && args.burn_ante && args.x.name == "accts.xfer_gc_to" && typeof args.x.call == "function" && $fs.accts.balance_of_owner() < ante) {
        let give_ante;

        give_ante = $fs.southr6.give_binmat_ante()
        args.x.call({ to: "burn", amount: ante })
        while (!give_ante.ok) {
            give_ante = $fs.southr6.give_binmat_ante()
        }

        if ($fs.accts.balance_of_owner() < 12000000) {
            give_ante = $fs.southr6.give_binmat_ante()
            args.x.call({ to: "burn", amount: ante })
            while (!give_ante.ok) {
                give_ante = $fs.southr6.give_binmat_ante()
            }
        }

    }

    if (!args || !args.loc || args.loc.name != "burn.info_6u4f65" || typeof args.loc.call != "function") {
        return `

            \`W--\` burn.play \`W--\`


\`UThis is a script to start and play a game of BINMAT against\` \`Cburn\`\`U.\`

\`UThe 8MGC ante will be provided. You must be at least tier 1.\`

\`Cburn\` ${$fs.accts.balance_of_owner() < ante ? "`Xdoes not have their ante.`\n\n`XPlease run:` burn.play { burn_ante: true, `Nx`:`V#s.accts.xfer_gc_to` }`" : "`Uhas their ante.`"}

\`Cburn\` \`Umay already be breached.\`

\`UTo start a game, enter hardline and run:\`

    burn.play { \`Nloc\`: \`V#s.burn.info_6u4f65\` }

\`UDo note that your loc will appear in\` \`Cburn\`\`U's access log, as you are trying to breach them.\`

\`UIf you experience an issue, please contact me directly.\`

`
    }

    let s = $hs.sys.status()

    if (s.breach) {
        return { ok: false, msg: "\n`UYou cannot play a game of BINMAT while breached.`" }
    }

    if (!s.hardline) {
        return { ok: false, msg: "\n`UYou have to be hardlined in order to play BINMAT.`" }
    }

    if (s.hardline && !s.breach) {
        if ($fs.accts.balance_of_owner() < ante) {
            return { ok: false, msg: "\n`Cburn` `Xdoes not have their ante.`\n\n`XPlease run:` burn.play { burn_ante: true, `Nx`:`V#s.accts.xfer_gc_to` }" }
        }
        let lcall = args.loc.call({})

        // return JSON.stringify(loc_call)

        if (lcall == "BINMAT Security Shell online. Affinity: NULL") {
            let give_ante = $fs.southr6.give_binmat_ante()

            while (!give_ante.ok) {
                give_ante = $fs.southr6.give_binmat_ante()
            }
        }

        return lcall
    }
}