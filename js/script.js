document.addEventListener('DOMContentLoaded', () => {
    fetch('assets/Mapa-das-Mesoregioes-de-Minas-Gerais.svg')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(svgData => {
            document.getElementById('map-container').innerHTML = svgData;
            return fetch('data/dados.json');
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('JSON data:', data);
            styleRegions(data);
            addRegionHoverListeners();
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

const regionIds = {
    'Noroeste de Minas': 3101,
    'Norte de Minas': 3102,
    'Jequitinhonha': 3103,
    'Vale do Mucuri': 3104,
    'Triangulo Mineiro': 3105,
    'Central Mineira': 3106,
    'Metropolitana de Belo Horizonte': 3107,
    'Vale do Rio Doce': 3108,
    'Oeste de Minas': 3109,
    'Sul': 3110,
    'Campo das Vertentes': 3111,
    'Zona da Mata': 3112
};

function styleRegions(data) {
    const totalClients = data.reduce((sum, region) => sum + region.clients, 0);

    data.forEach(region => {
        const regionId = regionIds[region.region];
        const regionElement = document.getElementById(regionId);
        if (regionElement) {
            const percentage = region.clients / totalClients;
            const color = getColor(percentage);
            regionElement.style.fill = color;

            addTooltip(regionElement, region.clients);
        } else {
            console.error(`Region element not found for region: ${region.region}`);
        }
    });
}

function getColor(percentage) {
    const blueValue = Math.round(percentage * 205 + 50); // 0% -> 50, 100% -> 255
    return `rgb(0, 0, ${blueValue})`;
}

function addTooltip(element, clients) {
    element.addEventListener('mouseenter', () => {
        // Adiciona a classe hover para alterar a aparência
        element.classList.add('hover');
        
        // Adiciona a classe region-hovered ao body
        document.body.classList.add('region-hovered');
        
        // Cria e exibe o tooltip
        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        tooltip.textContent = `Clientes: ${clients}`;
        document.body.appendChild(tooltip);
        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX}px`;
        tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight}px`;
    });

    element.addEventListener('mouseleave', () => {
        // Remove a classe hover
        element.classList.remove('hover');
        
        // Remove a classe region-hovered do body
        document.body.classList.remove('region-hovered');
        
        // Remove o tooltip
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    });
}


function addRegionHoverListeners() {
    const regions = Object.keys(regionIds);
    regions.forEach(regionName => {
        const regionId = regionIds[regionName];
        const regionElement = document.getElementById(regionId);
        const paragraphId = regionName.toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
        const paragraph = document.querySelector(`#nomes-mesorregioes p[id="${paragraphId}"]`);
        
        if (regionElement && paragraph) {
            regionElement.addEventListener('mouseenter', () => {
                paragraph.style.display = 'block';
            });
            regionElement.addEventListener('mouseleave', () => {
                paragraph.style.display = 'none';
            });
        } else {
            if (!regionElement) {
                console.error(`Region element not found for region: ${regionName}`);
            }
            if (!paragraph) {
                console.error(`Paragraph not found for region: ${regionName}`);
            }
        }
    });
}
