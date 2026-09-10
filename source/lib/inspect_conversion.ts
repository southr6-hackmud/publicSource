export function inspect_display_from_data(data: UserInspect, badge_info?: boolean) {
    try {
        let avatar = data.avatar.split("\n")
        let bio: string[] | undefined = data.bio ? data.bio.split("\n") : undefined
        let badges_expanded = badge_info

        let out = []

        out.push(...avatar)

        out[1] = `${out[1]}  \`C${data.title ? `${data.title} ` : ""}${data.username}${data.corp ? ` [${data.corp}]` : ""}\``
        out[2] = `${out[2]}  \`c${data.pronouns}\``

        if (bio) {
            for (let i = 0; i < bio.length; i++) {
                out[i + 4] = `${out[i + 4] ? out[i + 4] : ""}  ${bio[i]}`
            }
        }

        if (Object.keys(data).length > 4 || data.is_main) {
            // if (bio && bio.length > 2) {}
            if (bio) {
                switch (true) {
                    case bio.length < 3:
                        break
                    case bio.length == 3:
                        out.push("")
                        break
                    case bio.length > 3:
                        out.push("\n")
                }
            }
        }

        if (data.user_age) {
            let age = data.user_age

            const secLength = 1000
            const minLength = secLength * 60
            const hourLength = minLength * 60
            const dayLength = hourLength * 24
            let timeSince = Date.now() - age.valueOf()
            out.push(`\nUser for ${(timeSince - (timeSince % dayLength)) / dayLength} days \`C${age.getUTCFullYear().toString().slice(-2)}${(age.getUTCMonth() + 1).toString().padStart(2, "0")}${age.getUTCDate().toString().padStart(2, "0")}.${age.getUTCHours().toString().padStart(2, "0")}${age.getUTCMinutes().toString().padStart(2, "0")}\``)
        }

        if (data.alt_of || data.is_main) {
            out.push(
                `\n${data.is_main ? "This is a main user" : `This is an alt of \`C${data.alt_of}\``}`
            )
        }

        if (data.badges) {
            if (typeof data.badges[0] == "string") { badges_expanded = false }

            out.push(`\n\`B-badges-\`${!badges_expanded ? " `cdetails with badge_info: true`" : ""}`)

            if (badges_expanded) {
                let badges = data.badges
                let badges_out = []
                for (const badge of badges) {
                    let display = badge.badge.split("\n")
                    let description = badge.description.split("\n")
                    display[0] = `${display[0]}  \`B${badge.name}\``
                    for (let i = 0; i < description.length; i++) {
                        display[i + 1] = `${display[i + 1] ? display[i + 1] : ""}  ${description[i]}`
                    }
                    badges_out.push(display.join("\n"))
                }
                out.push(`\n${badges_out.join("\n\n\n")}`)
            }
            else {
                let badges = data.badges.map(v => typeof v == "string" ? v.split("\n") : v.badge.split("\n"))
                let badges_out = []
                for (let i = 0; i < 3; i++) {
                    badges_out.push(badges.map(v => v[i]).join(" "))
                }
                out.push(`\n${badges_out.join("\n")}`)
            }
        }

        return out.join("\n")
    } catch (error) {
        return `Errored on \`C${data.username}\`.\n\n${error}`
    }

}