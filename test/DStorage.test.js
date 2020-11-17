require('chai').use(require('chai-as-promised')).should()
const DStorage = artifacts.require('DStorage')

contract('DStorage', ([deployer, uploader]) => {
  let dstorage

  before(async () => {
    dstorage = await DStorage.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await dstorage.address
      expect(address).not.to.equal(0x0)
      expect(address).not.to.equal('')
      expect(address).not.to.equal(null)
      expect(address).not.to.equal(undefined)
    })

    it('has a name', async () => {
      const name = await dstorage.name()
      expect(name).to.equal('DStorage')
    })
  })

  describe('file', async () => {
    let file, fileCount
    const fileHash = 'd23c8d15a8603b5383bfc59e52287f0ffb338acb7d3d829d4c5550c89d336902'
    const fileSize = 1
    const fileType = 'fileType'
    const fileName = 'fileName'
    const fileDescription = 'fileDescription'

    before(async () => {
      file = await dstorage.uploadFile(fileHash, fileSize, fileType, fileName, fileDescription, { from: uploader })
      fileCount = await dstorage.fileCount()
    })

    it('upload file', async () => {
      expect(fileCount.toNumber()).to.eq(1)
      const event = file.logs[0].args

      expect(event.fileId.toNumber()).to.eq(fileCount.toNumber(), 'Id is correct')
      expect(event.fileHash).to.eq(fileHash, 'Hash is correct')
      expect(event.fileSize.toNumber()).to.eq(fileSize, 'Size is correct')
      expect(event.fileType).to.eq(fileType, 'Type is correct')
      expect(event.fileName).to.eq(fileName, 'Name is correct')
      expect(event.fileDescription).to.eq(fileDescription, 'Description is correct')
      expect(event.uploader).to.eq(uploader, 'Uploader is correct')

      // FAILURE: File must have hash
      await dstorage.uploadFile('', fileSize, fileType, fileName, fileDescription, { from: uploader }).should.be
        .rejected

      // FAILURE: File must have size
      await dstorage.uploadFile(fileHash, '', fileType, fileName, fileDescription, { from: uploader }).should.be
        .rejected

      // FAILURE: File must have type
      await dstorage.uploadFile(fileHash, fileSize, '', fileName, fileDescription, { from: uploader }).should.be
        .rejected

      // FAILURE: File must have name
      await dstorage.uploadFile(fileHash, fileSize, fileType, '', fileDescription, { from: uploader }).should.be
        .rejected

      // FAILURE: File must have description
      await dstorage.uploadFile(fileHash, fileSize, fileType, fileName, '', { from: uploader }).should.be.rejected
    })

    it('lists file', async () => {
      const file = await dstorage.files(fileCount)
      expect(file.fileId.toNumber()).to.eq(fileCount.toNumber(), 'id is correct')
      expect(file.fileHash).to.eq(fileHash, 'Hash is correct')
      expect(file.fileSize.toNumber()).to.eq(fileSize, 'Size is correct')
      expect(file.fileName).to.eq(fileName, 'Size is correct')
      expect(file.fileDescription).to.eq(fileDescription, 'description is correct')
      expect(file.uploader).to.eq(uploader, 'uploader is correct')
    })
  })
})
