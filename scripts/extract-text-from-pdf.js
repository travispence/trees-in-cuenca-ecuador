var path = require('path')
var filePath = path.join(process.cwd(), '/app/resources/data/arboles.pdf')
var extract = require('pdf-text-extract')

var writeFile = require('fs').writeFile;

const REGEX = RegExp(`[0-9]+[ ]*(Á|A)`);
const REGEX2 = RegExp('UNIVERSIDAD DEL AZUAY[ ]*[0-9]+');

const newline = '\n\n';


const outFile = `${process.cwd()}/app/resources/data/trees-temp.json`;

const numIntroPages = 19;
const keys = [
	'Familia:',
	'Nombre científico:',
	'Otros nombres comunes:',
	'Hábito:',
	'Hojas:',
	'Flores:',
	'Fruto:',
	'Distribución y ecología:',
	'Usos tradicionales:',
	'Propagación:',
	'Descripción:'
]


extract(filePath, function (err, pages) {
	if (err) {
		console.dir(err)
		return
	}
	const filtered = pages.slice(numIntroPages)
		.map((p, idx) => {
			return {
				page: idx + 20,
				text: p
			}
		})
		.filter(p => (REGEX.test(p.text) || REGEX2.test(p.text)));

	const output = filtered.map((data) => {
		let pdfPageTxt = data.text;
		let out = {
			page: data.page,
			original: data.text
		};

		let family = pdfPageTxt.split(keys[0])[1]
		out.familia = family ? family.split(newline)[0].trim().replace(/ .*/, '') : "";

		let name = pdfPageTxt.split(keys[0])[1];
		out.nombre = name ? name.split(keys[1])[0].replace(out.familia, '').trim() : '';


		let description = pdfPageTxt.split(keys[10])[1]
		out.descripcíon = description ? description.split(newline)[0].trim() : '';

		let nombre_comunes;
		if (description) {
			nombre_comunes = pdfPageTxt.split(keys[2])[1];
			out.otros_nombres_comunes = nombre_comunes ? nombre_comunes.split(keys[10][0])[0].split(',').map(s => s.replace('“', '').replace('”', '').trim()) : [];
		} else {
				nombre_comunes = pdfPageTxt.split(keys[2])[1];
				out.otros_nombres_comunes = nombre_comunes ? nombre_comunes.split(newline)[0].split(',').map(s => s.replace('“', '').replace('”', '').trim()) : [];
		}

		if (nombre_comunes) {
			let scientific_name = pdfPageTxt.split(keys[1])[1];
			out.nombre_cientifica = scientific_name ? scientific_name.split(keys[2])[0]
				.trim() : '';
		} else {
			let scientific_name = pdfPageTxt.split(keys[1])[1];
			out.nombre_cientifica = scientific_name ? scientific_name.split(newline)[0]
				.trim() : '';
		}


		let habitat = pdfPageTxt.split(keys[3])[1];
		out.habito = habitat ? habitat.split(newline)[0] : ''


		let leaves = pdfPageTxt.split(keys[4])[1];
		out.hojas = leaves ? leaves.split(newline)[0].trim() : '';;

		let flowers = pdfPageTxt.split(keys[5])[1];
		out.flores = flowers ? flowers.split(newline)[0].trim() : '';;

		let fruit = pdfPageTxt.split(keys[6])[1];
		out.fruta = fruit ? fruit.split(newline)[0].trim() : '';

		let dist_and_ecology = pdfPageTxt.split(keys[7])[1]
		out.distribucion_y_ecologia = dist_and_ecology ? dist_and_ecology.split(newline)[0].trim() : ''

		let traditional_uses = pdfPageTxt.split(keys[8])[1]
		out.usos_tradicionales = traditional_uses ? traditional_uses.split(newline)[0].trim() : '';


		out.propagacion = (pdfPageTxt.split(keys[9])[1]) ? pdfPageTxt.split(keys[9])[1].trim() : '';


		
		return out;

	});

	// console.log(JSON.stringify(output, null, 2));
	writeFile(outFile, JSON.stringify(output), function (err) {
		if (err) {
			console.error(err);
			process.exit(-1);
		}	
		process.exit(0);
	});
})