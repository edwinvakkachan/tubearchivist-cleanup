# orphan-cleanup

🧹 A Node.js-based Docker image that removes orphaned media metadata files from channel folders.

## Usage

Mount your media folder into the container:

```bash
docker run --rm -v /your/media/path:/app/media yourusername/orphan-cleanup:latest
