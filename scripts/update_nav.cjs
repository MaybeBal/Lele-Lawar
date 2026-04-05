const fs = require('fs');

const files = ['index.html', 'menu.html', 'cerita.html', 'lokasi.html'];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Replace desktop nav
    const desktopReplacement = `<a href="lokasi.html" class="nav-link">Lokasi</a>
                <div class="nav-dropdown">
                    <a href="#" class="nav-link" onclick="return false;">Pesan <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none" style="vertical-align: middle; margin-left: 4px;"><path d="M6 9l6 6 6-6"/></svg></a>
                    <div class="dropdown-content">
                        <a href="#" style="color: #00AA13; font-weight: 500;">GoFood</a>
                        <a href="#" style="color: #EE4D2D; font-weight: 500;">ShopeeFood</a>
                        <a href="#" style="color: #00B14F; font-weight: 500;">GrabFood</a>
                    </div>
                </div>`;

    // Some files might have `style="color:var(--text-black); font-weight:500;"` on the active link
    content = content.replace(/<a href="lokasi.html" class="nav-link"([^>]*)>Lokasi<\/a>/g, `<a href="lokasi.html" class="nav-link"$1>Lokasi</a>
                <div class="nav-dropdown">
                    <a href="#" class="nav-link" onclick="return false;">Pesan <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none" style="vertical-align: middle; margin-left: 4px;"><path d="M6 9l6 6 6-6"/></svg></a>
                    <div class="dropdown-content">
                        <a href="#" style="color: #00AA13; font-weight: 500;">GoFood</a>
                        <a href="#" style="color: #EE4D2D; font-weight: 500;">ShopeeFood</a>
                        <a href="#" style="color: #00B14F; font-weight: 500;">GrabFood</a>
                    </div>
                </div>`);

    // Replace mobile nav
    content = content.replace(/<a href="lokasi.html" class="mobile-link">Lokasi<\/a>/, `<a href="lokasi.html" class="mobile-link">Lokasi</a>
            <div style="height: 1px; background: rgba(0,0,0,0.1); width: 80%; margin: 15px auto;"></div>
            <span style="font-family: var(--font-heading); color: var(--text-gray); font-size: 1.1rem; margin-bottom: -15px;">Pesan Online:</span>
            <div style="display: flex; gap: 20px; justify-content: center;">
                <a href="#" style="color: #00AA13; font-weight: 600; text-decoration: none; font-size: 1.15rem;">GoFood</a>
                <a href="#" style="color: #EE4D2D; font-weight: 600; text-decoration: none; font-size: 1.15rem;">Shopee</a>
                <a href="#" style="color: #00B14F; font-weight: 600; text-decoration: none; font-size: 1.15rem;">Grab</a>
            </div>`);

    fs.writeFileSync(file, content);
});
console.log('Done!');
