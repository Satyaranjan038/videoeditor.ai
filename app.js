document.getElementById('uploadForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData();
    const video = document.getElementById('videoInput').files[0];
    const subtitleText = document.getElementById('subtitleText').value;
    const gender = document.getElementById('gender').value;

    formData.append('video', video);
    formData.append('text', subtitleText);
    formData.append('gender', gender);

    const response = await fetch('/upload', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    if (result.video_url) {
        document.getElementById('downloadLink').classList.remove('hidden');
        document.getElementById('downloadLink').setAttribute('href', result.video_url);

        // Store paths for deletion
        window.uploadedVideoPath = video_path;
        window.processedVideoPath = result.video_url;

        document.getElementById('deleteFiles').classList.remove('hidden');
    } else {
        alert(result.error || 'Something went wrong!');
    }
});

document.getElementById('deleteFiles').addEventListener('click', async function () {
    const response = await fetch('/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            video_path: window.uploadedVideoPath,
            processed_path: window.processedVideoPath
        })
    });

    const result = await response.json();
    if (result.message) {
        alert('Files deleted successfully!');
        document.getElementById('downloadLink').classList.add('hidden');
        document.getElementById('deleteFiles').classList.add('hidden');
    } else {
        alert(result.error || 'Failed to delete files.');
    }
});
