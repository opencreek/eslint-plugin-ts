import fs from "fs"
import path from "path"

const isTest = process.env.NODE_ENV === "test"

export function getPackageRoot(filePath: string): string {
    let ret = filePath
    if (isTest) return ""

    while (ret != "") {
        try {
            fs.accessSync(path.join(ret, "package.json"))
            return ret
        } catch {
            ret = path.dirname(ret)
        }
    }

    throw new Error("could not find a package.json in the parent directories")
}
