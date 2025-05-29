import { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";

const QRCodeGenerator = () => {
  const [url, setUrl] = useState("https://www.example.com/");
  const [size, setSize] = useState(300);
  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [logoImage, setLogoImage] = useState(null);
  const [dotStyle, setDotStyle] = useState("dots");
  const qrRef = useRef(null);
  const qrCode = useRef(null);
  const fileInputRef = useRef(null);
  const [qrType, setQrType] = useState("url"); // "url" o "contact"

  const [contact, setContact] = useState({
    name: "",
    lastName: "",
    org: "",
    title: "",
    phone: "",
    email: "",
  });

  const generateVCard = () => {
    return `BEGIN:VCARD
VERSION:3.0
N:${contact.lastName};${contact.name}
FN:${contact.name} ${contact.lastName}
ORG:${contact.org}
TITLE:${contact.title}
TEL;TYPE=cell:${contact.phone}
EMAIL:${contact.email}
END:VCARD`;
  };

  // Inicializar QR
  useEffect(() => {
    qrCode.current = new QRCodeStyling({
      width: size,
      height: size,
      data: qrType === "url" ? url : generateVCard(),
      image: logoImage,
      dotsOptions: {
        color: qrColor,
        type: dotStyle,
      },
      backgroundOptions: {
        color: bgColor,
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 0,
        imageSize: 0.2, // tamaño relativo al QR
      },
    });

    if (qrRef.current) {
      qrCode.current.append(qrRef.current);
    }

    return () => {
      if (qrRef.current) {
        qrRef.current.innerHTML = "";
      }
    };
  }, []);

  // Actualizar QR cuando cambien parámetros
  useEffect(() => {
    if (qrCode.current) {
      qrCode.current.update({
        width: size,
        height: size,
        data: qrType === "url" ? url : generateVCard(),
        image: logoImage,
        dotsOptions: {
          color: qrColor,
          type: dotStyle,
        },
        backgroundOptions: {
          color: bgColor,
        },
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 0,
          imageSize: 0.4, // tamaño relativo al QR
          hideBackgroundDots: true, // opcional
          imageBackgroundShape: "circle", // <-- este es el truco
        },
      });
    }
  }, [url, size, qrColor, bgColor, logoImage, dotStyle]);

  useEffect(() => {
    const vcard = generateVCard();
    setUrl(vcard);
  }, [contact]);

  // Subir logo
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadQR = () => {
    qrCode.current.download({ name: "qr-code", extension: "png" });
  };

  const handleRemoveLogo = () => {
    setLogoImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-emerald-500">
          Generador de QR Personalizado
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Panel de configuración */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
            <div className="border-b border-gray-700 p-4">
              <h2 className="text-xl font-semibold text-emerald-400">
                Configuración
              </h2>
            </div>

            {/* Tipo de contenido */}
            <div className="space-y-2 px-6 py-4">
              <label
                htmlFor="qrType"
                className="block text-sm font-medium text-gray-300"
              >
                Tipo de QR
              </label>
              <select
                id="qrType"
                value={qrType}
                onChange={(e) => setQrType(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: `right 0.5rem center`,
                  backgroundRepeat: `no-repeat`,
                  backgroundSize: `1.5em 1.5em`,
                  paddingRight: `2.5rem`,
                }}
              >
                <option value="url">URL</option>
                <option value="contact">Contacto</option>
              </select>
            </div>

            <div className="p-6 space-y-6">
              {/* URL Input */}
              {qrType !== "contact" && (
                <div className="space-y-2">
                  <label
                    htmlFor="url"
                    className="block text-sm font-medium text-gray-300"
                  >
                    URL
                  </label>
                  <input
                    id="url"
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="https://ejemplo.com"
                  />
                </div>
              )}

              {qrType === "contact" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-300">Nombre</label>
                      <input
                        type="text"
                        value={contact.name}
                        onChange={(e) =>
                          setContact({ ...contact, name: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-300">Apellido</label>
                      <input
                        type="text"
                        value={contact.lastName}
                        onChange={(e) =>
                          setContact({ ...contact, lastName: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-300">
                      Organización
                    </label>
                    <input
                      type="text"
                      value={contact.org}
                      onChange={(e) =>
                        setContact({ ...contact, org: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-300">Puesto</label>
                    <input
                      type="text"
                      value={contact.title}
                      onChange={(e) =>
                        setContact({ ...contact, title: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-300">Teléfono</label>
                    <input
                      type="text"
                      value={contact.phone}
                      onChange={(e) =>
                        setContact({ ...contact, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-300">Email</label>
                    <input
                      type="email"
                      value={contact.email}
                      onChange={(e) =>
                        setContact({ ...contact, email: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    />
                  </div>
                </div>
              )}

              {/* Tamaño */}
              <div className="space-y-2">
                <label
                  htmlFor="size"
                  className="block text-sm font-medium text-gray-300"
                >
                  Tamaño: {size}x{size}
                </label>
                <input
                  id="size"
                  type="range"
                  min="100"
                  max="500"
                  step="10"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>100px</span>
                  <span>300px</span>
                  <span>500px</span>
                </div>
              </div>

              {/* Colores */}
              <div className="grid grid-cols-2 gap-4">
                {/* Color del QR */}
                <div className="space-y-2">
                  <label
                    htmlFor="qrColor"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Color del QR
                  </label>
                  <div className="flex">
                    <input
                      id="qrColor"
                      type="color"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="w-12 h-10 p-1 bg-transparent border border-gray-600 rounded-l-md"
                    />
                    <input
                      type="text"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-r-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Color de fondo */}
                <div className="space-y-2">
                  <label
                    htmlFor="bgColor"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Color de fondo
                  </label>
                  <div className="flex">
                    <input
                      id="bgColor"
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-12 h-10 p-1 bg-transparent border border-gray-600 rounded-l-md"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-r-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Estilo de puntos */}
              <div className="space-y-2">
                <label
                  htmlFor="dotStyle"
                  className="block text-sm font-medium text-gray-300"
                >
                  Estilo de puntos
                </label>
                <select
                  id="dotStyle"
                  value={dotStyle}
                  onChange={(e) => setDotStyle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: `right 0.5rem center`,
                    backgroundRepeat: `no-repeat`,
                    backgroundSize: `1.5em 1.5em`,
                    paddingRight: `2.5rem`,
                  }}
                >
                  <option value="dots">Puntos</option>
                  <option value="rounded">Redondeado</option>
                  <option value="square">Cuadrado</option>
                  <option value="extra-rounded">Extra Redondeado</option>
                </select>
              </div>

              {/* Logo */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Logo (opcional)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    Subir logo
                  </button>
                  {logoImage && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                    >
                      Eliminar
                    </button>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Footer con botón de descarga */}
            <div className="border-t border-gray-700 p-4">
              <button
                type="button"
                onClick={downloadQR}
                className="w-full flex items-center justify-center px-4 py-2 bg-emerald-600 rounded-md text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Descargar QR
              </button>
            </div>
          </div>

          {/* Panel de vista previa */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
            <div className="border-b border-gray-700 p-4">
              <h2 className="text-xl font-semibold text-emerald-400">
                Vista previa
              </h2>
            </div>
            <div
              className="p-6 flex justify-center items-center"
              style={{ minHeight: "400px" }}
            >
              <div
                ref={qrRef}
                className="border-4 border-gray-700 rounded-lg overflow-hidden bg-white"
                style={{
                  minHeight: "300px",
                  minWidth: "300px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
