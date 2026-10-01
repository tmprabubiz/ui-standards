# BE-FILE · Files and media

How uploaded files are accepted, stored, served and processed. Load for any app where users upload, download or play files, images, audio or video.

## BE-FILE-01 · Upload handling and limits

**Purpose:** Accept only the files the app expects, so uploads cannot be used to attack the server or other users.
**Triggers:** upload, file upload, attachment, image upload, file size limit, file type, content type, filename, virus, multipart, avatar
**Applies when:** the server receives files from users.
**Composes:** BE-API-03, BE-FILE-02, BE-FILE-03, BE-OPS-04, FE-FORM-04

**Required**
- R1 A maximum file size and maximum files per request are enforced by the server (and the web server in front of it) while reading, not only after the whole file arrives.
- R2 Allowed types are an explicit allow-list per upload field; the type is determined by sniffing the file's content (signature bytes), and the extension and declared type must agree with it.
- R3 Files are stored under a server-generated random name; the client's filename is never used as a path and is kept only as sanitised display metadata.
- R4 Files are written outside the web-served directory and never executed; a file's type cannot make the server run it.
- R5 Uploaded images and documents that will be shown to others are re-encoded or processed in a safe way where possible (BE-FILE-03); archives are not unpacked blindly (size, depth and file-count limits).
- R6 Uploads require sign-in and permission to attach to the target record (CORE F11), and are rate limited and counted against a per-user quota.
- R7 Failures return problem-details errors with specific codes (`file_too_large`, `file_type_not_allowed`) per BE-API-02.

**Conditional**
- C1 IF files come from the public or from untrusted users THEN scan them for malware before they are made available.
- C2 IF SVG, HTML or similar active formats are allowed THEN serve them as downloads or from a separate domain, never inline on the app's own origin.
- C3 IF the same file may be uploaded twice THEN optionally deduplicate by content hash within one owner only.

**Suggest**
- S1 Malware scanning for every upload — protects people who open shared files.
- S2 Storage used per user shown in settings — avoids surprise limits.

**Approval**
- A1 Raising size limits above the defaults (25 MB for images and documents; 2 GB for audio and video, which also needs BE-FILE-04) — costs storage and bandwidth.
- A2 Accepting executables, archives or scriptable formats.
- A3 Paid scanning or storage services.

**Frontend contract**
- The upload field states the allowed types and maximum size, shows progress, and maps the server's error codes to plain messages (FE-FORM-04).
- The screen checks type and size before sending, but treats the server's answer as final.

**Acceptance**
- [ ] Given a `.jpg` file that is really an executable, when uploaded, then it is rejected with `file_type_not_allowed`.
- [ ] Given a file larger than the limit, when uploaded, then the response is 413 and nothing is stored.
- [ ] Given a filename `../../etc/passwd.png`, when uploaded as a valid image, then it is stored under a random name and the path is unaffected.
- [ ] Given a user without access to the target record, when they upload to it, then the response is 404 or 403.

**Exceptions**
- Internal tools with only trusted staff uploading may skip C1; R1 to R4 still apply.

**Source:** OWASP File Upload Cheat Sheet (standard); OWASP ASVS 4.0.3 V12 Files and Resources (standard); RFC 9110 on 413 (standard); content sniffing and random names (convention)

## BE-FILE-02 · Storage and access

**Purpose:** Keep files private to the people allowed to see them, while still letting those people download or view them fast.
**Triggers:** file storage, download, signed URL, private files, public link, bucket, CDN, file permissions, expiring link, serve file, avatar URL
**Applies when:** stored files are shown or downloaded later.
**Composes:** BE-FILE-01, BE-AUTH-05, BE-DATA-03, BE-DATA-05, FE-MEDIA-01

**Required**
- R1 Storage is private by default: no file is reachable by a guessable or listable address.
- R2 Access is through the app: the server checks the caller may see this file's record (CORE F11), then issues a short-lived signed address (default 15 minutes) or streams the file.
- R3 Signed addresses are never stored long-term and never logged in full (BE-OPS-02); the stored value is the file's key.
- R4 Downloads send the correct `Content-Type`, `X-Content-Type-Options: nosniff` and a safe `Content-Disposition` (attachment unless the type is known-safe to display).
- R5 Each file belongs to a record and an owner in the database; when the record is purged, its files are removed by the purge job (BE-DATA-03).
- R6 Stored files are included in backup or versioning protection (BE-DATA-05).

**Conditional**
- C1 IF files must be public (logo, public share) THEN place them in a separate public location marked as such, never in the private store.
- C2 IF a CDN or other provider serves files THEN signed access must still apply to private files.
- C3 IF a file is replaced THEN the old file is removed or versioned deliberately, and caches are invalidated.

**Suggest**
- S1 Different expiry for views and downloads — limits how long a leaked link works.
- S2 Count downloads per file — helps spot unusual access.

**Approval**
- A1 Making any file public to anyone with the link.
- A2 Storing files in another region or country (transfer rules and cost).
- A3 Choosing a paid storage or CDN provider.

**Frontend contract**
- Screens ask the API for a file's address when needed (not at list time for large lists) and re-request it when it expires.
- A failed or expired address shows a retry rather than a broken image (FE-MEDIA-01, CORE F4).

**Acceptance**
- [ ] Given a private file, when its storage address is requested directly without a signature, then access is denied.
- [ ] Given a user without access to a file's record, when they request an address for it, then the response is 404 and no address is issued.
- [ ] Given a signed address past its expiry, when it is used, then it fails.
- [ ] Given a purged record, when the purge job completes, then its files no longer exist in storage.

**Exceptions**
- Public marketing assets of the app itself (logo, screenshots) may be served openly.

**Source:** OWASP ASVS 4.0.3 V12 Files and Resources (standard); OWASP File Upload Cheat Sheet (standard); private storage with expiring signed URLs (convention)

## BE-FILE-03 · Media processing

**Purpose:** Turn uploaded media into safe, fast-to-show versions without making people wait or exposing private details.
**Triggers:** thumbnail, resize, image processing, transcode, video conversion, EXIF, GPS metadata, audio processing, waveform, compress, preview
**Applies when:** uploaded images, audio or video are shown to people, or need conversion.
**Composes:** BE-FILE-01, BE-JOB-01, FE-MEDIA-01, FE-MEDIA-02, FE-FEED-04

**Required**
- R1 Processing runs as a background job, not inside the upload request, and the record has a status: `pending`, `processing`, `ready`, `failed`.
- R2 Images shown to anyone but the uploader are stripped of metadata that can reveal private details, including location (EXIF GPS) and device identifiers.
- R3 Thumbnails or previews in the sizes the screens need are generated and linked to the original; original files are kept unless the owner approved otherwise.
- R4 Limits protect the server: maximum pixel dimensions, duration and processing time; decompression bombs and oversized frames are refused.
- R5 A failure leaves the original usable, sets `failed` with a reason code, and is retried according to BE-JOB-01; it never leaves a half-made file looking ready.
- R6 Processing tools run with limited privileges and time, on files already accepted by BE-FILE-01.

**Conditional**
- C1 IF video or audio is played in browsers THEN transcode to widely supported formats and produce streamable output.
- C2 IF photos are public THEN offer the uploader a choice to keep or remove location data, defaulting to remove.
- C3 IF processing takes long THEN report progress so screens can show it (FE-FEED-04).

**Suggest**
- S1 Automatic rotation from camera orientation — photos appear upright.
- S2 Poster frames for videos and waveforms for audio — faster visual scanning in lists.
- S3 Modern compressed image formats — smaller pages and lower bandwidth.

**Approval**
- A1 Paid media-processing services (per-minute or per-image cost, and files leave your system).
- A2 Discarding original files after processing.

**Frontend contract**
- Screens show a placeholder while status is `pending` or `processing`, the media when `ready`, and an error with retry when `failed` (FE-MEDIA-01, FE-FEED-04).
- Screens poll or subscribe for status changes without blocking the user.

**Acceptance**
- [ ] Given a photo with GPS metadata, when it is processed for sharing, then the shared versions contain no GPS data.
- [ ] Given an upload, when the request returns, then the record status is `pending` or `processing` and the request did not wait for conversion.
- [ ] Given a corrupt video, when processing fails, then the status is `failed` with a reason and the original is still stored.
- [ ] Given an image beyond the dimension limit, when uploaded, then it is rejected with a specific error code.

**Exceptions**
- Apps that only store and return files untouched (no previews) can skip R3 and C1, but keep R2 if images are shared.

**Source:** OWASP File Upload Cheat Sheet (standard); OWASP ASVS 4.0.3 V12 (standard); asynchronous processing with status, metadata stripping (convention)

## BE-FILE-04 · Large and resumable uploads

**Purpose:** Let big files upload reliably over poor connections, resuming rather than starting again after an interruption.
**Triggers:** large file, resumable upload, chunked upload, multipart upload, big video, interrupted upload, resume, tus, direct upload, upload progress
**Applies when:** files may exceed what one request can reliably carry (roughly over 25 MB) or users upload on weak connections.
**Composes:** BE-FILE-01, BE-FILE-02, BE-JOB-02, FE-FORM-04, FE-FEED-04

**Required**
- R1 The server (or storage provider) creates an upload session with the declared total size, type and owner, and refuses sizes above the limit at creation (BE-FILE-01).
- R2 Parts have a fixed size range; each is acknowledged with the received offset or part number, so clients can resume from the last confirmed point.
- R3 Each part is verified by size and checksum; the assembled file is verified again before it is accepted.
- R4 Finishing an upload runs the full BE-FILE-01 checks (content sniffing, allow-list) and then BE-FILE-03; a file is not usable before this passes.
- R5 Incomplete sessions expire (default 24 hours) and a scheduled job deletes their parts (BE-JOB-02).
- R6 Sessions belong to a user and can be used only by them (CORE F11); the total stored per user is counted in the quota.

**Conditional**
- C1 IF the client uploads directly to storage THEN the server issues scoped, short-lived credentials for that one object only and verifies the result on completion.
- C2 IF the upload is cancelled THEN the server removes the parts promptly.
- C3 IF the same upload session is finished twice THEN the second call returns the first result.

**Suggest**
- S1 Use an open resumable upload protocol (such as tus) — reuses well-tested client and server libraries.
- S2 Background upload on mobile — people can leave the screen while a video uploads.

**Approval**
- A1 Raising the maximum size (costs storage and bandwidth).
- A2 Letting the client write directly to the storage provider (changes the security design).

**Frontend contract**
- The upload field shows progress, a cancel action and a resume prompt after interruption (FE-FORM-04, FE-FEED-04).
- On reconnect the screen asks the server how much arrived and sends only the rest.

**Acceptance**
- [ ] Given an upload interrupted at 60%, when the client reconnects, then it resumes from the confirmed offset and the final file is complete.
- [ ] Given a part with a wrong checksum, when received, then it is rejected and can be resent.
- [ ] Given an upload session older than the expiry, when the cleanup job runs, then its parts are deleted.
- [ ] Given a declared size above the limit, when the session is created, then it is refused with a size error.

**Exceptions**
- Apps whose files are always small can use single-request uploads from BE-FILE-01.

**Source:** tus resumable upload protocol and provider multipart upload (convention); RFC 9110 range and size semantics (standard); OWASP File Upload Cheat Sheet (standard)
