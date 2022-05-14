import { h, Component, render } from 'https://cdn.skypack.dev/preact?min';
import { useEffect, useState } from 'https://cdn.skypack.dev/preact/hooks?min';
import htm from 'https://cdn.skypack.dev/htm?min';

const html = htm.bind(h);

const collections = {
  bayc: {
    name: 'BAYC',
    apiUrl:
      'https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq',
  },
  mayc: {
    name: 'MAYC (not supported yet)',
    apiUrl: 'https://boredapeyachtclub.com/api/mutants',
    disabled: true,
  },
};

async function getImageUrl(apiUrl, tokenId) {
  return fetch(`${apiUrl}/${tokenId}`)
    .then((response) => response.json())
    .then(({ image }) => {
      const imageId = image.match(/\w+$/)[0];
      return imageId;
    })
    .then((imageId) => `https://ipfs.io/ipfs/${imageId}`)
    .catch((err) => {
      console.log('Something went wrong:', err);
    });
}

function useOnMount(callback) {
    useEffect(callback, []);
}

function App() {
  const [imageUrl, setImageUrl] = useState('');
  const [tokenId, setTokenId] = useState(0);
  const [collection, setCollection] = useState('bayc');
  const apiUrl = collections[collection].apiUrl;

  useOnMount(() => {
    updateImage();
  })

  function updateImage(e) {
    e?.preventDefault();
    getImageUrl(apiUrl, tokenId).then(setImageUrl);
  }

  function updateCollection(e) {
    setCollection(e.target.value);
  }

  function updateToken(e) {
    const tokenId = e.target.value;
    if (tokenId.length === 0) return;
    setTokenId(tokenId);
  }

  const options = Object.entries(collections).map(
    ([id, data]) =>
      html`
        <option value="${id}" disabled="${data.disabled}">${data.name}</option>
      `
  );

  return html`
    <div class="col">
        <div class="container">
            <div class="row">
                <div class="col">
                    <h1 class="title">High-Res Yuga PFPs</h1>
                    <form class="col" onSubmit="${updateImage}">
                        <div class="form-item">
                            <label for="update-collection">Select collection:</label>
                            <select id="update-collection" onChange="${updateCollection}">
                            ${options}
                            </select>
                        </div>
                        <div class="form-item">
                            <label for="update-token">Enter token ID:</label>
                            <input
                            id="update-token"
                            type="number"
                            min="0"
                            step="1"
                            value="${tokenId}"
                            onInput="${updateToken}"
                            />
                        </div>
                        <div class="form-item">
                            <input type="submit" value="Submit" />
                        </div>
                    </form>
                </div>
                <div class="col">
                    <img src="${imageUrl}" />
                </div>
            </div>
        </div>
    </div>
  `;
}

render(html`<${App} />`, document.body);
