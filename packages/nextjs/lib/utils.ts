import fs from "fs"

const isTest = process.env.NODE_ENV === "test"

export function getPackageRoot(path: string): string {
    let ret = path
    if (isTest) return ""

    while (ret != "") {
        try {
            fs.accessSync(ret)
            return ret
        } catch {
            ret = ret.substring(0, ret.lastIndexOf("/"))
        }
    }

    throw new Error("could not find a package.json in the parent directories")
}
