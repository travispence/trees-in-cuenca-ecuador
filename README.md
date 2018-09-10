Trees In Cuenca Ecuador
==========================


### Description

> Important! I am not the owner nor  do I claim copyright on the content from the PDF. All credit belongs to:


This purpose of this project is to demonstrate how text and images can be scraped from a PDF using NodeJS. It is then displayed
with a very simple AngularJS application.


The images in the PDF are first dumped to an SVG format with a utility created by the team of PDF.js. The base64 content is then extracted and saved into the individual files. The naming convention is such that the photos can then later be associated with the appropriate tree.

### Technologies and Methodologies Used

- AngularJS
- Spectre Front End Library
- NodeJS
- Regular Expressions
- JSON / SVG



### Building the data


```
node scripts/dump-pdf-to-svg.js app/resources/data/arboles.pdf
node scripts/extract-images-from-svg.js 
node scripts/extract-text-from-pdf.js
node scripts/associate-images-to-tree-group.js 
```

