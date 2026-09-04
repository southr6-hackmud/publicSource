type ParsedArgs = {
    [arg: string]:
    (
        (boolean | string | number)
        |
        (boolean | string | number)[]
    )
    |
    {
        [arg: string]:
        (boolean | string | number)
        |
        (boolean | string | number)[]
    }
}

type ParseOut = {
    input: string,
    remainder?: string,
    parsedArgs: ParsedArgs
}

type ParseOptions = {
    [option: string]: boolean | string[] | undefined,
    parse_string_bool?: boolean | string[],
    parse_string_num?: boolean | string[],
    parse_nested_input?: boolean,
    boolean_flags?: false | string[]
}

type Aliases = { [key: string]: string[] }

type HTTPS_CLI = {
    cli: () => {
        (input: string): ParseOut,
        aliases: () => Aliases,
        set_aliases: (aliases: Aliases) => void,
        add_alias: (key: string, alias: string[]) => void,
        options: () => ParseOptions,
        set_options: (options: ParseOptions) => void
    }


    // cli: () => {
    //     (input: string): {
    //         input: string,
    //         remainder: string,
    //         parsedArgs: { [arg: string]: boolean | string | string[] }
    //     },
    //     aliases: () => { [key: string]: string[] },
    //     set_aliases: (aliases: { [key: string]: string[] }) => void,
    //     add_alias: (key: string, alias: string[]) => void,
    //     options: () => ParseOptions,
    //     set_options: (options: ParseOptions) => void
    // }
}

