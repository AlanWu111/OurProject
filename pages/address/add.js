// pages/address/add.js
var cityList = require('./cityList').cityList;
import WxValidate from '../../utils/WxValidate'
import {
  addUserAddr, getUserAddr
} from '../../utils/apis'
import {
  alert, getCurrentAddress, reverseGeocoder,
  getPrevPage
} from '../../utils/util'
Page({
  data: {
    address: {},

    showArea: false,
    currentTab: 1,
    country: [],
    residecity: [],
    resideprovince: [],

    curr_pro: '',
    curr_cit: '',
    curr_cou: '',
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.id = options.id
    this.callback = options.callback || 'callback'
    this.initValidate()
    if (this.id) {
      this.loadData()
    } else {
      this.initAddress()
    }
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  initValidate() {
    this.validate = new WxValidate({
      receiver: {
        required: true,
      },
      phone: {
        required: true,
        tel: true,
      },
    }, {
        receiver: {
          required: '请输入您的姓名'
        },
        phone: {
          required: '请输入手机号',
          tel: '请输入有效手机号码'
        },
      })
  },

  initAddress() {
    var that = this
    getCurrentAddress(address => {
      that.setData({
        address
      })
    })
  },
  choosearea: function () {

    let result = this.data.address;
    var currentTab = 1;
    if (result.country) {
      currentTab = 3;
    } else if (result.residecity) {
      currentTab = 3;
    } else if (result.resideprovince) {
      currentTab = 1;
    } else {
      currentTab = 1;
    }

    let resideprovince = [];
    let residecity = [];
    let country = [];

    cityList.forEach((item) => {
      resideprovince.push({
        name: item.name
      });
      if (item.name == result.resideprovince) {
        item.city.forEach((item) => {
          residecity.push({
            name: item.name
          });
          if (item.name == result.residecity) {
            item.area.forEach((item) => {
              country.push({
                name: item.name
              });
            });
          }
        });
      }
    });

    this.setData({
      showArea: true,
      resideprovince: resideprovince,
      residecity: residecity,
      country: country,

      currentTab: currentTab,
      curr_pro: result.resideprovince || '请选择',
      curr_cit: result.residecity || '请选择',
      curr_cou: result.country || '请选择',
    });
  },
  areaClose: function () {
    this.setData({
      showArea: false
    });
  },
  //点击省选项卡
  resideprovince: function (e) {
    this.setData({
      currentTab: 1
    });
  },
  //点击市选项卡
  residecity: function () {
    this.setData({
      currentTab: 2
    });
  },
  country: function () {
    this.setData({
      currentTab: 3
    });
  },
  //点击选择省
  selectResideprovince: function (e) {
    let residecity = [];
    let country = [];
    let name = e.currentTarget.dataset.itemName;

    cityList.forEach((item) => {
      if (item.name == name) {
        item.city.forEach((item, index) => {
          residecity.push({
            name: item.name
          });
          if (index == 0) {
            item.area.forEach((item) => {
              country.push({
                name: item.name
              });
            });
          }
        });
      }
    });

    this.setData({
      currentTab: 2,
      residecity: residecity,
      country: country,
      curr_pro: e.currentTarget.dataset.itemName,
      curr_cit: '请选择',
      curr_cou: '',
    });
  },
  //点击选择市
  selectResidecity: function (e) {
    let country = [];
    let name = e.currentTarget.dataset.itemName;
    cityList.forEach((item) => {
      if (item.name == this.data.curr_pro) {
        item.city.forEach((item, index) => {
          if (item.name == name) {
            item.area.forEach((item) => {
              country.push({
                name: item.name
              });
            });
          }
        });
      }
    });

    this.setData({
      currentTab: 3,
      country: country,
      curr_cit: e.currentTarget.dataset.itemName,
      curr_cou: '请选择',
    });
  },
  //点击选择区
  selectCountry: function (e) {
    this.data.curr_cou = e.currentTarget.dataset.itemName;

    this.data.address.resideprovince = this.data.curr_pro;
    this.data.address.residecity = this.data.curr_cit;
    this.data.address.country = this.data.curr_cou;
    this.setData({
      showArea: false,
      curr_cou: this.data.curr_cou,
      address: this.data.address
    });
  },
  // 滑动切换tab
  bindChange: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current + 1
    });
  },
  loadData() {
    var that = this
    var addr_id = this.id
    wx.showNavigationBarLoading()
    getUserAddr({
      addr_id,
      success(data) {
        that.setData({
          receiver: data.receiver,
          phone: data.phone,
          detail: data.detail,
          address: {
            resideprovince: data.addr_name,
            residecity: data.city_name,
            country: data.district_name,
            resideprovince_id: data.resideprovince_id,
            residecity_id: data.residecity_id,
            country_id: data.country_id,
          }
        })
        wx.hideNavigationBarLoading()
      },
      error() {
        wx.hideNavigationBarLoading()
      }
    })
  },


  formSubmit(e) {
    var that = this
    var { loading, address } = this.data
    if (loading) {
      return
    }

    if (!address) {
      return alert('请选择收货地址')
    }

    if (!this.validate.checkForm(e)) {
      const error = this.validate.errorList[0]
      return alert(error.msg)
    }
    this.setData({
      loading: true
    })
    var {
      receiver, phone, detail
    } = e.detail.value
    addUserAddr({
      receiver, phone, detail,
      address,
      addr_id: that.id,
      success(data) {
        that.setData({
          loading: false
        })
        getPrevPage()[that.callback]()
        wx.navigateBack()
      },
      error() {
        that.setData({
          loading: false
        })
      }
    })
  },
})