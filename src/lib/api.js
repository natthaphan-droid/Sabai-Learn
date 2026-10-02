export async function api(path, { body, ...options } = {}) {
  let response;
  try {
    response = await fetch(`/api${path}`, { credentials: 'same-origin', ...options, headers: { ...(body && !(body instanceof File) ? { 'Content-Type': 'application/json' } : {}), ...options.headers }, body: body === undefined ? undefined : body instanceof File ? body : JSON.stringify(body) });
  } catch { throw new Error('เชื่อมต่อไม่ได้ กรุณาตรวจอินเทอร์เน็ตแล้วลองใหม่'); }
  let data; try { data = await response.json(); } catch { throw new Error('ระบบกำลังเตรียมพร้อม กรุณาลองใหม่หรือติดต่อครู'); }
  if (response.headers.get('X-Sabai-Test-Mode') === 'true') document.documentElement.dataset.sabaiTest = 'true';
  if (!response.ok) {
    const error = new Error(data.error || 'ไม่สามารถทำรายการได้');
    error.status = response.status;
    if (response.status === 401) window.dispatchEvent(new Event('sabai:unauthorized'));
    throw error;
  }
  return data;
}
export async function upload(file, target) {
  const extension = file.name.split('.').pop().toLowerCase();
  const types = { pdf: 'application/pdf', doc: 'application/msword', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
  return (await api(`/files?${new URLSearchParams(target)}`, { method: 'POST', headers: { 'Content-Type': types[extension] || file.type, 'X-File-Name': encodeURIComponent(file.name), 'X-File-Size': String(file.size) }, body: file })).file;
}
