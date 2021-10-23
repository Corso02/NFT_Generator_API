let path = require("path")
let spriterSVG = require("svg-sprite")
let fs = require("fs")

let config = {
    dest: '../results', // Main output directory
    log: null, // Logging verbosity (default: no logging)
    shape: { // SVG shape related options
        id: { // SVG shape ID related options
            separator: '--', // Separator for directory name traversal
            pseudo: '~' // File name separator for shape states (e.g. ':hover')
        },
        dimension: {// Dimension related options
            maxWidth: 2000, // Max. shape width
            maxHeight: 2000, // Max. shape height
            precision: 5, // Floating point precision
            attributes: false, // Width and height attributes on embedded shapes
        },
        spacing: { // Spacing related options
            padding: 0, // Padding around all shapes
            box: 'content' // Padding strategy (similar to CSS `box-sizing`)
        },
        transform: ['svgo'], // List of transformations / optimizations
        meta: null, // Path to YAML file with meta / accessibility data
        align: null, // Path to YAML file with extended alignment data
        dest: null // Output directory for optimized intermediate SVG shapes
    },
    svg: { // General options for created SVG files
        xmlDeclaration: true, // Add XML declaration to SVG sprite
        doctypeDeclaration: true, // Add DOCTYPE declaration to SVG sprite
        namespaceIDs: true, // Add namespace token to all IDs in SVG shapes
        namespaceClassnames: true, // Add namespace token to all CSS class names in SVG shapes
        dimensionAttributes: true // Width and height attributes on the sprite
    },
    variables: {}, // Custom Mustache templating variables and functions
    mode: {
        stack: true
    }
}

let spriter = new spriterSVG(config)

exports.upload = (req, res) => {
    console.log(req.files)
    for(let i = 0; i < req.files.svgs.length; i++){
        spriter.add(path.resolve("../", req.files.svgs[i].tempFilePath), null, fs.readFileSync(path.resolve("../", req.files.svgs[i].tempFilePath), "utf8"))    
    }
    let resultSvgs = []
    spriter.compile((err, result) => {
        for(let mode in result){
            for(let resource in result[mode]){
                resultSvgs.push(result[mode][resource].contents.toString("utf8"))          
            }
        }
        let filteredSvgs = []
        for(let idx in resultSvgs){
            let svg = resultSvgs[idx]
            if(svg.includes("<style>")){
                let styleBeginIdx = svg.indexOf("<style>")
                let styleEndIdx = svg.indexOf("</style>")
                let firstHalf = svg.substring(0, styleBeginIdx)
                let secondHalf = svg.substring(styleEndIdx + 8)
                let finalSvg = firstHalf + secondHalf
                filteredSvgs.push(finalSvg)
            }
        }
        console.log(filteredSvgs)
        res.send({filteredSvgs})
    })
}