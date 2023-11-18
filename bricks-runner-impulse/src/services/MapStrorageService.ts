import saveas from 'file-saver';

const map2 = `
▓ M              ▓
▓▓▓▓▓▓▓▓╡▓▓▓▓▓▓▓▓▓
▓       ╡        ▓
▓▓▓▓▓▓▓▓▓▓▓▓╡▓▓▓▓▓
▓           ╡    ▓
▓▓▓╡▓▓▓▓▓╡▓▓▓▓╡▓▓▓
▓  ╡     ╡   $╡  ▓
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
    `;

export class MapStorageService {
    readMap = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            var reader = new FileReader();
            reader.onload = (e) => {
                const contents = e.target.result;
                resolve(contents.toString().trim());
            };
            reader.readAsText(file);
        });
    };

    saveMap = (map: string) => {
        var blob = new Blob([map], { type: 'text/plain;charset=utf-8' });

        saveas(blob, 'save.txt');
    };

    isMapInCache = (): boolean => {
        const map = localStorage.getItem('map');
        return Boolean(map);
    };

    getDefaultMap = () => map2;

    cacheMap = (map: string) => {
        localStorage.setItem('map', map);
    };

    getMapFromCache = () => localStorage.getItem('map');
}
