API design overview

/documents

- GET /documents -> [Documents]
  > let's start with just retreiving all the docs, but it could get overwhelming and we cound need to just return their metadata
- GET /documents/:id
- GET /upload-url
  > the service prepares the upload by requesting a presigned upload URL to S3
  > security would be worse (what happens between this call and the next is on the client), but less load on backend so better performance
- POST /documents
  > this is the upload route
- DELETE /documents/:id
  > this deletes a single documents
- PUT /documents/:id
  > replace actual document for a specific ID
- PATCH / document/:id
  > update metadata
