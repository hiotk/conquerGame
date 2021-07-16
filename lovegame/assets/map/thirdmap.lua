return {
  version = "1.2",
  luaversion = "5.1",
  tiledversion = "1.2.1",
  orientation = "orthogonal",
  renderorder = "right-down",
  width = 50,
  height = 50,
  tilewidth = 16,
  tileheight = 16,
  nextlayerid = 11,
  nextobjectid = 1,
  properties = {},
  tilesets = {
    {
      name = "tileset1",
      firstgid = 1,
      tilewidth = 16,
      tileheight = 16,
      spacing = 0,
      margin = 0,
      columns = 49,
      image = "tileset1.png",
      imagewidth = 784,
      imageheight = 4600,
      tileoffset = {
        x = 0,
        y = 0
      },
      grid = {
        orientation = "orthogonal",
        width = 16,
        height = 16
      },
      properties = {},
      terrains = {},
      tilecount = 14063,
      tiles = {
        {
          id = 0,
          animation = {
            {
              tileid = 0,
              duration = 300
            },
            {
              tileid = 1,
              duration = 300
            },
            {
              tileid = 2,
              duration = 300
            },
            {
              tileid = 3,
              duration = 300
            },
            {
              tileid = 4,
              duration = 300
            },
            {
              tileid = 5,
              duration = 300
            },
            {
              tileid = 6,
              duration = 300
            },
            {
              tileid = 7,
              duration = 300
            }
          }
        },
        {
          id = 98,
          animation = {
            {
              tileid = 98,
              duration = 300
            },
            {
              tileid = 99,
              duration = 300
            },
            {
              tileid = 100,
              duration = 300
            },
            {
              tileid = 101,
              duration = 300
            },
            {
              tileid = 102,
              duration = 300
            }
          }
        }
      }
    }
  },
  layers = {
    {
      type = "tilelayer",
      id = 1,
      name = "water",
      x = 0,
      y = 0,
      width = 50,
      height = 50,
      visible = true,
      opacity = 1,
      offsetx = 0,
      offsety = 0,
      properties = {},
      encoding = "base64",
      compression = "zlib",
      chunks = {
        {
          x = 0, y = -32, width = 16, height = 16,
          data = "eJxjYBgFo2BwgRMSA+2CkQMAQncA4Q=="
        },
        {
          x = 0, y = -16, width = 16, height = 16,
          data = "eJxjYBh6IEKKgSFSaqBdQX8gJU2cOkY0TCqA6auQpkz/Sgr1U+r+Uf2E9QMA7aYClA=="
        },
        {
          x = 0, y = 0, width = 16, height = 16,
          data = "eJxjYMAEjGiYVDDU9Y+CUTBSAAA8YAAR"
        }
      }
    },
    {
      type = "tilelayer",
      id = 3,
      name = "floor",
      x = 0,
      y = 0,
      width = 50,
      height = 50,
      visible = true,
      opacity = 1,
      offsetx = 0,
      offsety = 0,
      properties = {},
      encoding = "base64",
      compression = "zlib",
      chunks = {
        {
          x = 0, y = -32, width = 16, height = 16,
          data = "eJxjYBgFQwG0MjEwtDGRr38bUO92LPpB5oozE8bPgepeYFELMleSmXwM0u8FpL2ZsbvbB6oOlxqQ/mqguA4jdv21UP241MD06xKhH5saauhfA5RbC8TroGphfGxi6HxKwx8ADOseiw=="
        },
        {
          x = 16, y = -32, width = 16, height = 16,
          data = "eJxjYBgFIxmIMyOwBDPp+iWZEdiTDP0g4EOh/tohrH8tUM86CvRTGv4AmJoG4g=="
        },
        {
          x = 0, y = -16, width = 16, height = 16,
          data = "eJzbxsTAIMlMGHsBMTawjQkh740F+0D1VxPQD5LXZUTFOkBcS4H+3wyk6//FALEXZgZM/xogXgvF65DEYPpBbHEsGKYWV/hsIzL87wLxPSy4Aogr0fB6oJkboHgjAfN1oOEM8zeIfsCECJ9HTJjmI+PfUH3INLp+dHlkGh3g0o8N/8ISn9j0g8R+MWDS2kTarw21Dxs9FOz/xoAdg/QDAIR/XR4="
        },
        {
          x = 16, y = -16, width = 16, height = 16,
          data = "eJxjYIAAD2YGBk9mBrLBNqahqX8tMwQ/J1O/N1CPDxBLkhl+94B67lOgX5IZgcnRX8mMwFVk6P8NxDqMCJoc/dqMCHoU0BcAAGxzEJg="
        },
        {
          x = 0, y = 0, width = 16, height = 16,
          data = "eJxjYEAFv4H4AROC/wjI/saAHWszMmCAoa5/FIyCkQQAy/QixQ=="
        }
      }
    },
    {
      type = "tilelayer",
      id = 8,
      name = "growup",
      x = 0,
      y = 0,
      width = 50,
      height = 50,
      visible = true,
      opacity = 1,
      offsetx = 0,
      offsety = 0,
      properties = {},
      encoding = "base64",
      compression = "zlib",
      chunks = {
        {
          x = 0, y = -32, width = 16, height = 16,
          data = "eJxjYBgFo2AUUAsIMlNHDb0AAByqACk="
        },
        {
          x = 0, y = -16, width = 16, height = 16,
          data = "eJxjYBg8IBkN01K/EzMZFoyCUTDMAAAPGgNe"
        }
      }
    },
    {
      type = "tilelayer",
      id = 4,
      name = "object",
      x = 0,
      y = 0,
      width = 50,
      height = 50,
      visible = true,
      opacity = 1,
      offsetx = 0,
      offsety = 0,
      properties = {},
      encoding = "base64",
      compression = "zlib",
      chunks = {
        {
          x = 0, y = -32, width = 16, height = 16,
          data = "eJztyzkKgDAURdFnshOnvVo5bchpQ069txFiCFhqkQun+PC+FIv9o9pIDVp06M37xm3gHjFhxhL49zduK/eGHQfOwL+/uasSKbVShhwFSvv8DW2+7gKrihcY"
        },
        {
          x = 16, y = -32, width = 16, height = 16,
          data = "eJxjYBgFo2DgwGQmyvQfoVD/Vwr1qzFTpn+gAQDw1QJ8"
        },
        {
          x = 0, y = -16, width = 16, height = 16,
          data = "eJxjYCAeiLIwMIgBsTgQSwCxJAuqvCUa5kLT7wZU7w7EHkDsCcReaPoJgXKg+gogrgTiKiCuJlH/CqD6lUC8CohXA/EaEvUPNEAPW8uBdQ5NQC4WMfR0BcPZWNRakWCXxah+BgB/AQ4f"
        },
        {
          x = 16, y = -16, width = 16, height = 16,
          data = "eJyTYmFgkAZicoE3UK8PBfprgHprKdC/Fqh3HQX6BxpYDrQDRsGIBgDZ/QN6"
        },
        {
          x = 0, y = 0, width = 16, height = 16,
          data = "eJxjYEAFVgzEAwssYkNd/ygYBSMJAAA2WgHJ"
        }
      }
    },
    {
      type = "tilelayer",
      id = 5,
      name = "building",
      x = 0,
      y = 0,
      width = 50,
      height = 50,
      visible = true,
      opacity = 1,
      offsetx = 0,
      offsety = 0,
      properties = {},
      encoding = "base64",
      compression = "zlib",
      chunks = {
        {
          x = 0, y = -32, width = 16, height = 16,
          data = "eJxjYBgFo4A6II6JgSEeiBOAOBGIk5gIqxksIIKROmoGM3jCzMDwFIifAfFzIH4BxABlzwiw"
        },
        {
          x = 16, y = -32, width = 16, height = 16,
          data = "eJxjYBgFo4B8kMQ00C4Y2eAlMwPDK2by9QMAJZMCPg=="
        }
      }
    },
    {
      type = "tilelayer",
      id = 6,
      name = "above",
      x = 0,
      y = 0,
      width = 50,
      height = 50,
      visible = true,
      opacity = 1,
      offsetx = 0,
      offsety = 0,
      properties = {},
      encoding = "base64",
      compression = "zlib",
      chunks = {}
    }
  }
}
