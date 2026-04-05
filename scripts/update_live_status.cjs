const fs = require('fs');
const files = ['index.html', 'menu.html', 'cerita.html', 'lokasi.html'];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    const logoHtmlOriginal = `<a href="index.html" class="logo">Lele<span class="text-blue">Lawar.</span></a>`;
    const logoHtmlNew = `<span style="display: flex; align-items: center; gap: 15px;">
                <a href="index.html" class="logo">Lele<span class="text-blue">Lawar.</span></a>
                <span id="liveStatusBadge" class="status-badge checking" style="display:none;"></span>
            </span>`;

    content = content.replace(logoHtmlOriginal, logoHtmlNew);
    fs.writeFileSync(file, content);
});
console.log('Done updating HTML!');
