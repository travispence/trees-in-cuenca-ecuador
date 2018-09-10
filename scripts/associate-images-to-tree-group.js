const readdir = require('fs').readdir;
const trees = require(`${process.cwd()}/app/resources/data/trees-temp.json`);
const inputDir = `${process.cwd()}/app/resources/img/`;


const writeFile = require('fs').writeFile;
const outFile = `${process.cwd()}/app/resources/data/trees.json`;


function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}

const treeIndexBoundrys = trees.map((t, idx) => {
    if (!trees[idx + 1]) {
        return {
            idx: idx,
            page: t.page,
            next_page: null
        }
    }
    return {
        idx: idx,
        page: t.page,
        next_page: trees[idx + 1].page
    }
})

// Read images and 
readdir(inputDir, (err, files) => {
    if (err) {
        console.error(err);
        process.exit(-1);
    }
    files = files.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));

    files.forEach(fileName => {
        console.log(fileName)
        let page = fileName.split('-')[1].split('_')[0];

        page = page ? parseInt(page, 10) : NaN;
        let targetIdx = treeIndexBoundrys.filter((tib) => {
            return (tib.page <= page && page < tib.next_page)
        })[0];

        if (targetIdx) {
            targetIdx = targetIdx.idx
        }



        if (isNumeric(targetIdx) && trees[targetIdx] && Array.isArray(trees[targetIdx].images)) {
            fileName = '/resources/img/' + fileName
            trees[targetIdx].slug = slugify(trees[targetIdx].nombre)
            trees[targetIdx].images.push(fileName)
        } else if (isNumeric(targetIdx) && trees[targetIdx]) {
            trees[targetIdx].images = ['/resources/img/' + fileName]
            trees[targetIdx].slug = slugify(trees[targetIdx].nombre);
        }
    })
    // console.log(JSON.stringify(trees, null, 2));
    writeFile(outFile, JSON.stringify(trees), function (err) {
        if (err) {
            console.error(err);
            process.exit(-1);
        }
        process.exit(0);
    });
});